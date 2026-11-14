// ASSETS ------------------------------------------------------------------------------------------------------------------------------------------|
import rateLimitCover from "../../../assets/blog/rate-limiting.jpg"

// STYLES ------------------------------------------------------------------------------------------------------------------------------------------|
import styles from "../BlogPost.module.css"

// METADATA ----------------------------------------------------------------------------------------------------------------------------------------|
export const postMeta = {
    slug: "epoll-tcp-framing-and-backpressure",
    index: "02",
    topic: "Networking",
    tags: ["TCP/IP", "epoll", "POSIX Sockets", "Rate Limiting"],
    date: "Oct 2026",
    readTime: "12 min read",
    author: "Aarav Malik",
    title: "Non-Blocking I/O, TCP Stream Framing, and Edge Backpressure in High-Concurrency Proxies",
    excerpt: "Why TCP is a byte stream rather than a message queue—and how event-driven epoll loops, bounded read buffers, and atomic Redis rate limits protect backend services.",
    coverImage: rateLimitCover,
    coverAlt: "Distributed network gateway lattice filtering luminous green packet pulses",
    takeaways: [
        "TCP delivers an unstructured stream of bytes; one recv() call can return half a frame or five concatenated commands.",
        "Edge-triggered epoll (EPOLLET) minimizes syscall overhead but requires draining sockets completely until EAGAIN.",
        "Unbounded per-connection write queues under slow-client backpressure cause cascading out-of-memory failures.",
        "Combining local token buckets with atomic Redis sliding-window pipelines protects upstream pools from coordinated bursts."
    ]
}

export const postToc = [
    { id: "byte-stream-myth", heading: "1. The First Networking Bug: Treating TCP Like Packets" },
    { id: "blocking-vs-epoll", heading: "2. Moving From Thread-Per-Connection to Event-Driven epoll" },
    { id: "length-prefixed-framing", heading: "3. Deterministic Binary Framing vs. Delimiter Scanning" },
    { id: "slow-client-backpressure", heading: "4. Backpressure and the Slow-Reader Memory Trap" },
    { id: "distributed-rate-limiting", heading: "5. Enforcing Distributed Quotas Without Race Conditions" },
    { id: "graceful-retry-contracts", heading: "6. Polite Failure: HTTP 429, Retry-After, and Jittered Recovery" }
]

const EPOLL_CODE = `bool drain_socket(Connection& conn) {
    uint8_t scratch[8192];
    while (true) {
        ssize_t n = ::recv(conn.fd, scratch, sizeof(scratch), 0);
        if (n > 0) {
            conn.rx_buf.append(scratch, static_cast<size_t>(n));
            continue;
        }
        if (n == 0) return false; // Peer closed TCP stream cleanly
        if (errno == EINTR) continue;
        if (errno == EAGAIN || errno == EWOULDBLOCK) break;
        return false; // Fatal socket error
    }
    return parse_available_frames(conn);
}`

const LUA_RATE_LIMIT_CODE = `local key = KEYS[1]
local capacity = tonumber(ARGV[1])
local refill_per_ms = tonumber(ARGV[2])
local now_ms = tonumber(ARGV[3])

local data = redis.call('HMGET', key, 'tokens', 'ts')
local tokens = tonumber(data[1]) or capacity
local last_ts = tonumber(data[2]) or now_ms

local elapsed = math.max(0, now_ms - last_ts)
tokens = math.min(capacity, tokens + elapsed * refill_per_ms)

local allowed = 0
if tokens >= 1 then
    tokens = tokens - 1
    allowed = 1
end

redis.call('HMSET', key, 'tokens', tokens, 'ts', now_ms)
redis.call('PEXPIRE', key, math.ceil(capacity / refill_per_ms) + 1000)
return { allowed, math.floor(tokens) }`

// ARTICLE COMPONENT -------------------------------------------------------------------------------------------------------------------------------|
export default function EpollTcpBackpressurePost({ CodeBlock }) {
    return (
        <>
            <section id = "byte-stream-myth" className = {styles.proseSection}>
                <h2 className = {styles.sectionHeading}>1. The First Networking Bug: Treating TCP Like Packets</h2>
                <p className = {styles.paragraph}>
                    Every systems engineer writes the same bug on their first socket server: calling send() once on the client with a 128-byte payload and assuming a single recv() on the server yields those exact 128 bytes. Over loopback on an idle laptop, it often works 99% of the time—and then silently corrupts state in production under packet fragmentation, Nagle coalescing, or pipelined requests.
                </p>
                <p className = {styles.paragraph}>
                    TCP guarantees ordered, reliable delivery of a continuous byte stream, not discrete messages. A single recv() can return 17 bytes of a header, or it can return three complete requests plus the first 4 bytes of a fourth. Any custom wire protocol or HTTP proxy parser must maintain a per-connection state machine backed by a persistent input buffer.
                </p>
                <aside className = {styles.calloutBox}>
                    <span className = {styles.calloutLabel}>Engineering Principle</span>
                    <p className = {styles.calloutText}>
                        Never assume recv() aligns with send(). Design your parser as a resumable state machine that advances its read cursor only when complete frames are verified.
                    </p>
                </aside>
            </section>

            <section id = "blocking-vs-epoll" className = {styles.proseSection}>
                <h2 className = {styles.sectionHeading}>2. Moving From Thread-Per-Connection to Event-Driven epoll</h2>
                <p className = {styles.paragraph}>
                    Spawning one OS thread per TCP client works comfortably up to a few hundred idle connections, after which 8 MB default thread stacks, kernel scheduling overhead, and context-switch cache thrashing begin eroding useful CPU cycles. For proxies and in-memory brokers handling thousands of keep-alive sockets, non-blocking I/O multiplexed with Linux epoll flips the scaling curve.
                </p>
                <p className = {styles.paragraph}>
                    In a reactor loop, every client file descriptor is configured with O_NONBLOCK. When epoll_wait() wakes up, it hands your event loop only the descriptors ready for reading or writing. With edge-triggered mode (EPOLLET), the kernel notifies you only on state transitions (empty to readable), forcing you to drain recv() in a loop until it returns -1 with errno == EAGAIN or EWOULDBLOCK.
                </p>
                <CodeBlock title = "Edge-Triggered Non-Blocking Socket Drain (C++ / POSIX)" code = {EPOLL_CODE} />
            </section>

            <section id = "length-prefixed-framing" className = {styles.proseSection}>
                <h2 className = {styles.sectionHeading}>3. Deterministic Binary Framing vs. Delimiter Scanning</h2>
                <p className = {styles.paragraph}>
                    When designing wire protocols or internal RPC hops, length-prefixed framing outperforms delimiter-based text protocols like newline-delimited JSON or raw RESP strings. Scanning every byte for &apos;\r\n&apos; forces O(n) character inspection across large payloads and requires escaping binary blobs.
                </p>
                <p className = {styles.paragraph}>
                    By starting every frame with a fixed 4-byte network-order uint32 length header (plus a 1-byte protocol version and flags byte), the parser checks conn.rx_buf.size() &gt;= 5 in constant O(1) time, validates that payload_len &lt;= kMaxFrameBytes to thwart memory-exhaustion attacks, and waits for remaining bytes if the full payload has not arrived yet.
                </p>
            </section>

            <section id = "slow-client-backpressure" className = {styles.proseSection}>
                <h2 className = {styles.sectionHeading}>4. Backpressure and the Slow-Reader Memory Trap</h2>
                <p className = {styles.paragraph}>
                    Upstream services are fast; mobile clients on congested cellular links are slow. If an edge proxy reads 50 MB/s from an internal microservice and tries to write it to a client whose TCP send window is stalled, send() quickly returns EAGAIN. If you blindly append unsent bytes into an unbounded std::vector tx_buf, a handful of slow or malicious clients will exhaust server RAM.
                </p>
                <p className = {styles.paragraph}>
                    Resilient proxies enforce strict per-connection high-water marks on outbound buffers. Once tx_buf crosses a threshold (for example, 1 MB), the reactor pauses reading from the upstream socket (removing EPOLLIN interest on the upstream pipe) so TCP backpressure propagates naturally all the way back to the producer—or drops/closes chronically stalled consumers after a write deadline.
                </p>
                <ul className = {styles.sectionBullets}>
                    <li className = {styles.sectionBulletItem}>
                        Set TCP_NODELAY on interactive RPC and proxy sockets to disable Nagle&apos;s 40ms delayed-ACK stall.
                    </li>
                    <li className = {styles.sectionBulletItem}>
                        Arm EPOLLOUT only when tx_buf is non-empty; disarm it immediately once drained to avoid busy-spin wakeups.
                    </li>
                    <li className = {styles.sectionBulletItem}>
                        Track idle and slowloris header timeouts in a timing wheel so half-open connections cannot hoard file descriptors.
                    </li>
                </ul>
            </section>

            <section id = "distributed-rate-limiting" className = {styles.proseSection}>
                <h2 className = {styles.sectionHeading}>5. Enforcing Distributed Quotas Without Race Conditions</h2>
                <p className = {styles.paragraph}>
                    Once a proxy can handle tens of thousands of connections efficiently, its next responsibility is protecting downstream databases and microservices from burst abuse. Process-local counters fail across horizontally scaled proxy replicas, while naive GET-then-INCR calls to Redis introduce check-then-act race windows under AsyncIO concurrency.
                </p>
                <p className = {styles.paragraph}>
                    In RateGuard&apos;s edge design, atomic Redis pipelines and Lua scripts collapse the read, prune, increment, and TTL assignment into a single server-side execution step. Sliding Window Log (using a Redis ZSET keyed by client identity) eliminates boundary double-bursts completely, while Token Bucket (storing tokens + last_refill_ms in a Redis Hash) keeps memory O(1) per client for massive API traffic.
                </p>
                <CodeBlock title = "Atomic Redis Lua Token Bucket Check" code = {LUA_RATE_LIMIT_CODE} />
            </section>

            <section id = "graceful-retry-contracts" className = {styles.proseSection}>
                <h2 className = {styles.sectionHeading}>6. Polite Failure: HTTP 429, Retry-After, and Jittered Recovery</h2>
                <p className = {styles.paragraph}>
                    Dropping overloaded packets silently causes blind client retries that amplify outages. Returning HTTP 429 Too Many Requests with accurate Retry-After and X-RateLimit-Remaining headers—paired with server-recommended jitter—teaches well-behaved SDKs to desynchronize their backoff waves so downstream microservices recover smoothly once the spike subsides.
                </p>
            </section>
        </>
    )
}
