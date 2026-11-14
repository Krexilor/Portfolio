// PURE SYSTEMS & BACKEND ENGINEERING SIMULATIONS -----------------------------------------------------------------------------------|

// (1) FNV-1a 32-bit Hash
export function fnv1a32(input) {
    let hash = 0x811c9dc5
    const str = String(input ?? "")
    for (let i = 0; i < str.length; i++) {
        hash ^= str.charCodeAt(i)
        hash = Math.imul(hash, 0x01000193)
    }
    return hash >>> 0
}

// (2) Consistent Hash Ring
export function buildHashRing(nodes, vnodesPerNode = 6) {
    if (!Array.isArray(nodes) || nodes.length === 0) return []
    const count = Math.max(1, Math.min(24, Math.floor(vnodesPerNode)))
    const ring = []

    for (const nodeId of nodes) {
        for (let v = 0; v < count; v++) {
            const hash = fnv1a32(`${nodeId}#v${v}`)
            const angleDeg = (hash / 0xffffffff) * 360
            ring.push({
                nodeId,
                vnodeIndex: v,
                hash,
                angleDeg
            })
        }
    }

    ring.sort((a, b) => a.hash - b.hash)
    return ring
}

export function resolveRingKey(ring, key) {
    if (!Array.isArray(ring) || ring.length === 0) {
        return { key: String(key ?? ""), keyHash: 0, keyAngleDeg: 0, targetNode: null, hops: 0 }
    }

    const cleanKey = String(key ?? "").trim()
    const keyHash = fnv1a32(cleanKey)
    const keyAngleDeg = (keyHash / 0xffffffff) * 360

    let low = 0
    let high = ring.length - 1
    let idx = 0

    while (low <= high) {
        const mid = (low + high) >> 1
        if (ring[mid].hash >= keyHash) {
            idx = mid
            high = mid - 1
        }
        else {
            low = mid + 1
        }
    }

    if (ring[idx].hash < keyHash) {
        idx = 0
    }

    return {
        key: cleanKey,
        keyHash,
        keyAngleDeg,
        targetNode: ring[idx].nodeId,
        matchedVnode: `${ring[idx].nodeId}#v${ring[idx].vnodeIndex}`,
        ringIndex: idx
    }
}

export function simulateKeyDistribution(nodes, keys, vnodesPerNode = 6) {
    const ring = buildHashRing(nodes, vnodesPerNode)
    const counts = {}
    for (const node of nodes) {
        counts[node] = 0
    }

    const assignments = []
    for (const key of keys) {
        const match = resolveRingKey(ring, key)
        if (match.targetNode) {
            counts[match.targetNode] = (counts[match.targetNode] || 0) + 1
        }
        assignments.push(match)
    }

    return { ring, counts, assignments }
}

// (3) Concurrency & Lock Contention Model
export function simulateLockContention({ threads = 8, writeRatio = 25, strategy = "rw-lock" }) {
    const workers = Math.max(1, Math.min(32, Number(threads) || 1))
    const writes = Math.max(0, Math.min(100, Number(writeRatio) || 0)) / 100
    const reads = 1 - writes

    let baseOpsPerWorker = 14000
    let contentionFactor = 0.08

    if (strategy === "coarse-mutex") {
        contentionFactor = Math.min(0.94, 0.14 * Math.max(0, workers - 1))
    }
    else if (strategy === "rw-lock") {
        const writePressure = writes * workers * 0.22
        const readOverlap = reads * 0.03 * workers
        contentionFactor = Math.min(0.88, Math.max(0.03, writePressure + readOverlap))
        baseOpsPerWorker = 16500
    }
    else {
        const shards = 16
        const collision = 1 - Math.pow(1 - 1 / shards, Math.max(0, workers - 1))
        contentionFactor = Math.min(0.65, Math.max(0.02, collision * (0.28 + writes * 0.72)))
        baseOpsPerWorker = 19000
    }

    const idealThroughput = workers * baseOpsPerWorker
    const throughputOps = Math.round(idealThroughput * (1 - contentionFactor * 0.78))
    const contentionPct = Math.round(contentionFactor * 100)
    const p50Ms = Number((0.18 + contentionFactor * 2.4).toFixed(2))
    const p99Ms = Number((0.45 + Math.pow(contentionFactor, 1.45) * 18.5).toFixed(2))

    return {
        strategy,
        workers,
        writePct: Math.round(writes * 100),
        throughputOps,
        contentionPct,
        p50Ms,
        p99Ms
    }
}

// (4) Contact Form Validation
export function validateContactForm(values) {
    const errors = {}
    const name = String(values?.name ?? "").trim()
    const email = String(values?.email ?? "").trim()
    const subject = String(values?.subject ?? "").trim()
    const message = String(values?.message ?? "").trim()

    if (name.length < 2) {
        errors.name = "Please enter your name (at least 2 characters)."
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = "Please provide a valid email address."
    }

    if (subject.length < 3) {
        errors.subject = "Please add a brief subject line."
    }

    if (message.length < 10) {
        errors.message = "Please include a short message (at least 10 characters)."
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors
    }
}
