// ASSETS ------------------------------------------------------------------------------------------------------------------------------------------|
import aofCover from "../../../assets/blog/aof-durability.jpg"

// STYLES ------------------------------------------------------------------------------------------------------------------------------------------|
import styles from "../BlogPost.module.css"

// METADATA ----------------------------------------------------------------------------------------------------------------------------------------|
export const postMeta = {
    slug: "cpp-storage-arenas-aof-durability",
    index: "01",
    topic: "C++ Backend",
    tags: ["C++20", "Concurrency", "AOF Persistence", "POSIX"],
    date: "Nov 2026",
    readTime: "11 min read",
    author: "Aarav Malik",
    title: "Lock Striping, Arena Allocation, and Crash-Safe AOF Durability in C++ Storage Engines",
    excerpt: "A systems-level walkthrough of why global mutexes and unbuffered write() calls collapse tail latency under concurrent workloads—and how to architect deterministic C++ storage backends.",
    coverImage: aofCover,
    coverAlt: "Isometric illustration of memory blocks flushing along lime traces into layered disk platters",
    takeaways: [
        "Replacing a single global std::mutex with cache-line-aligned striped locks scales read/write throughput nearly linearly across worker threads.",
        "POSIX write() only copies pages into the Linux kernel page cache; true durability requires decoupled batch flushing with fsync() off the hot path.",
        "Pre-allocating slab or arena buffers eliminates malloc contention and keeps p99 allocation latency predictable during burst traffic.",
        "Length-prefixed binary AOF frames with CRC32 checksums let cold-start recovery truncate partial tail writes safely after power loss."
    ]
}

export const postToc = [
    { id: "hot-path-bottlenecks", heading: "1. Where Naive C++ Key-Value Backends Break Under Load" },
    { id: "striped-locking-cache-lines", heading: "2. Striped Partition Locking and False Sharing Avoidance" },
    { id: "arena-memory-control", heading: "3. Taming Heap Fragmentation with Slab & Arena Buffers" },
    { id: "page-cache-vs-fsync", heading: "4. Why POSIX write() Is Not Durability" },
    { id: "group-commit-flusher", heading: "5. Decoupled Group Commit & Double-Buffered AOF Flushing" },
    { id: "binary-recovery-replay", heading: "6. Checksummed Binary Framing & Safe Cold-Start Replay" }
]

const SHARD_CODE = `struct alignas(64) StorageShard {
    std::shared_mutex mutex;
    std::unordered_map<std::string, Entry, StringHash, std::equal_to<>> map;
};

class StripedStore {
public:
    static constexpr size_t kShardCount = 64;

    std::optional<std::string> get(std::string_view key) const {
        const auto& shard = shard_for(key);
        std::shared_lock lock(shard.mutex);
        if (auto it = shard.map.find(key); it != shard.map.end() && !it->second.expired()) {
            return it->second.value;
        }
        return std::nullopt;
    }

    void set(std::string key, std::string value, uint64_t ttl_ms) {
        auto& shard = shard_for(key);
        std::unique_lock lock(shard.mutex);
        shard.map.insert_or_assign(std::move(key), Entry{std::move(value), now_ms() + ttl_ms});
    }

private:
    std::array<StorageShard, kShardCount> shards_;
    const StorageShard& shard_for(std::string_view key) const noexcept {
        return shards_[fnv1a_64(key) & (kShardCount - 1)];
    }
};`

const AOF_CODE = `class AofWriter {
public:
    void append_frame(std::span<const std::byte> frame) {
        std::lock_guard lock(buf_mutex_);
        active_buf_.insert(active_buf_.end(), frame.begin(), frame.end());
        if (active_buf_.size() >= kBatchThresholdBytes) {
            cv_.notify_one();
        }
    }

    void flusher_loop(std::stop_token st) {
        while (!st.stop_requested()) {
            {
                std::unique_lock lock(buf_mutex_);
                cv_.wait_for(lock, std::chrono::milliseconds(50), [&] {
                    return !active_buf_.empty() || st.stop_requested();
                });
                flush_buf_.swap(active_buf_);
            }
            if (!flush_buf_.empty()) {
                write_all(aof_fd_, flush_buf_);
                ::fsync(aof_fd_);
                flush_buf_.clear();
            }
        }
    }
};`

// ARTICLE COMPONENT -------------------------------------------------------------------------------------------------------------------------------|
export default function CppStorageArenasPost({ CodeBlock }) {
    return (
        <>
            <section id = "hot-path-bottlenecks" className = {styles.proseSection}>
                <h2 className = {styles.sectionHeading}>1. Where Naive C++ Key-Value Backends Break Under Load</h2>
                <p className = {styles.paragraph}>
                    When you first build an in-memory key-value engine in C++, the architecture feels deceptively clean: wrap an std::unordered_map inside a std::mutex, spawn a thread pool accepting TCP clients, and append every mutation to an Append-Only File (AOF). At low concurrency—say two or four clients firing sequential requests—the server responds in microseconds and saturates neither CPU nor disk.
                </p>
                <p className = {styles.paragraph}>
                    The illusion shatters the moment twenty concurrent clients send mixed GET and SET traffic. Every worker thread serializes behind one coarse lock, turning a multi-core Linux machine into a single-file queue. Worse, if a single SET triggers a synchronous disk flush or a heap reallocation inside std::unordered_map rehash while holding that global mutex, every unrelated GET on cold keys stalls behind it.
                </p>
                <aside className = {styles.calloutBox}>
                    <span className = {styles.calloutLabel}>Engineering Principle</span>
                    <p className = {styles.calloutText}>
                        Latency spikes in C++ backends rarely come from raw instruction cost—they come from lock hold duration, false sharing across CPU cache lines, and unplanned kernel I/O inside critical sections.
                    </p>
                </aside>
            </section>

            <section id = "striped-locking-cache-lines" className = {styles.proseSection}>
                <h2 className = {styles.sectionHeading}>2. Striped Partition Locking and False Sharing Avoidance</h2>
                <p className = {styles.paragraph}>
                    The cleanest jump in concurrency without diving into lock-free hazard pointers is keyspace striping. Instead of guarding one giant hash table with one mutex, partition the store into N independent shards (typically a power of two such as 64 or 256). Hash the incoming key once with a fast non-cryptographic mixer like FNV-1a or xxHash, mask the lower bits to pick the shard index, and acquire only that shard&apos;s std::shared_mutex.
                </p>
                <p className = {styles.paragraph}>
                    A subtle hardware trap awaits here: if you store 64 std::shared_mutex objects contiguously in an array, multiple mutexes share the same 64-byte CPU cache line. When Core 1 mutates Shard 0&apos;s lock state, Core 2&apos;s cache line holding Shard 1 invalidates and bounces across the interconnect. Aligning each shard structure with alignas(64) guarantees each lock lives on its own cache line.
                </p>
                <CodeBlock title = "Cache-Line-Aligned Striped Shard Map (C++20)" code = {SHARD_CODE} />
            </section>

            <section id = "arena-memory-control" className = {styles.proseSection}>
                <h2 className = {styles.sectionHeading}>3. Taming Heap Fragmentation with Slab &amp; Arena Buffers</h2>
                <p className = {styles.paragraph}>
                    Every small std::string key or value under 15–22 bytes triggers Small String Optimization (SSO), avoiding the heap. Anything larger calls into the global allocator. Under sustained SET/DEL churn with varying payload sizes, general-purpose allocators fragment pages and introduce mutex contention inside arena bins.
                </p>
                <p className = {styles.paragraph}>
                    For protocol parsing and command staging, request-scoped bump arenas eliminate per-token heap allocations completely. When a worker thread reads a binary frame off a POSIX socket, it slices headers and payloads directly into a thread-local scratch arena using std::string_view, executes the lookup or mutation, and resets the arena offset back to zero in a single pointer assignment.
                </p>
                <ul className = {styles.sectionBullets}>
                    <li className = {styles.sectionBulletItem}>
                        Parse incoming wire commands into zero-copy std::string_view slices backed by the connection&apos;s ring buffer.
                    </li>
                    <li className = {styles.sectionBulletItem}>
                        Reserve shard hash buckets upfront during startup so rehash storms never stall peak traffic windows.
                    </li>
                    <li className = {styles.sectionBulletItem}>
                        Bound maximum payload size per frame so a malformed client packet cannot trigger unbounded memory growth.
                    </li>
                </ul>
            </section>

            <section id = "page-cache-vs-fsync" className = {styles.proseSection}>
                <h2 className = {styles.sectionHeading}>4. Why POSIX write() Is Not Durability</h2>
                <p className = {styles.paragraph}>
                    Once data lives safely in sharded memory, the next question is crash survival. Calling ::write(aof_fd, buf, len) returns as soon as the kernel copies bytes into the OS page cache. Linux marks those pages dirty and flushes them to NVMe or SSD blocks seconds later via background pdflush/writeback threads. If the container or host loses power before writeback finishes, acknowledged writes vanish silently.
                </p>
                <p className = {styles.paragraph}>
                    However, calling ::fsync(aof_fd) synchronously on every mutation inside the shard lock destroys throughput—even fast NVMe drives exhibit 0.3ms to 4ms fsync tail latencies under concurrent load, capping single-key throughput at a few hundred writes per second.
                </p>
            </section>

            <section id = "group-commit-flusher" className = {styles.proseSection}>
                <h2 className = {styles.sectionHeading}>5. Decoupled Group Commit &amp; Double-Buffered AOF Flushing</h2>
                <p className = {styles.paragraph}>
                    Production engines like Redis and RocksDB resolve this tension with group commit: worker threads serialize committed mutations into an active in-memory append buffer under a brief spin or light mutex, then return or wait on a sequence condition depending on the configured durability policy (always, everysec, or buffered).
                </p>
                <p className = {styles.paragraph}>
                    A dedicated background AOF flusher thread swaps the active buffer with an empty standby buffer in O(1) pointer swap time—releasing worker threads immediately—then drains the full batch to disk via write_all() followed by a single ::fsync() call covering dozens or hundreds of batched commands at once.
                </p>
                <CodeBlock title = "Double-Buffered Background AOF Flusher (C++)" code = {AOF_CODE} />
            </section>

            <section id = "binary-recovery-replay" className = {styles.proseSection}>
                <h2 className = {styles.sectionHeading}>6. Checksummed Binary Framing &amp; Safe Cold-Start Replay</h2>
                <p className = {styles.paragraph}>
                    If the process crashes mid-write, the tail of the AOF file may hold a half-written command frame. Text protocols struggle to distinguish truncated payloads from valid empty strings without fragile heuristics. Framing each AOF record as [uint32 length][uint8 opcode][payload bytes][uint32 crc32] makes crash recovery deterministic.
                </p>
                <p className = {styles.paragraph}>
                    On restart, the recovery scanner reads frames sequentially, verifies the CRC32 digest against the payload, and applies valid mutations into the striped store before binding the listening TCP socket. If the final record fails length bounds or checksum verification, the engine logs the exact byte offset, calls ::ftruncate() to clip the incomplete tail, and boots cleanly into a consistent state.
                </p>
            </section>
        </>
    )
}
