// PURE SYSTEMS & BACKEND ENGINEERING SIMULATIONS --------------------------------------------------------------------------------------------------|

// (1) CACHE SPEED LAB
export const CACHE_ITEMS = [
    { id: "profile", label: "User Profile", tag: "4 KB" },
    { id: "feed", label: "Home Feed", tag: "18 KB" },
    { id: "scores", label: "Top Scores", tag: "2 KB" },
    { id: "settings", label: "App Settings", tag: "1 KB" },
    { id: "cart", label: "Shopping Cart", tag: "3 KB" },
    { id: "alerts", label: "Notifications", tag: "6 KB" }
]

export const CACHE_HIT_MS = 5
export const CACHE_MISS_MS = 120

export const CACHE_BURSTS = {
    popular: ["profile", "feed", "profile", "scores", "feed", "profile", "scores", "profile"],
    random: ["profile", "feed", "scores", "settings", "cart", "alerts", "profile", "settings"]
}

export function createCacheSimState({ capacity = 3 } = {}) {
    const safeCap = Math.max(2, Math.min(4, Math.round(Number(capacity) || 3)))
    return {
        capacity: safeCap,
        slots: [],
        hits: 0,
        misses: 0,
        totalLatencyMs: 0,
        seq: 0,
        lastEvent: {
            seq: 0,
            type: "idle",
            itemId: null,
            itemLabel: null,
            latencyMs: null,
            evictedLabel: null,
            message: "Pick any item below to send a request."
        },
        history: []
    }
}

export function requestCacheItem(state, itemId) {
    const item = CACHE_ITEMS.find((entry) => entry.id === itemId)
    if (!item) return state

    const nextSeq = (state.seq || 0) + 1
    const existingIdx = state.slots.findIndex((slot) => slot.id === item.id)

    if (existingIdx !== -1) {
        const existing = state.slots[existingIdx]
        const promoted = { ...existing, hits: existing.hits + 1 }
        const remaining = state.slots.filter((_, idx) => idx !== existingIdx)
        const nextSlots = [promoted, ...remaining]

        const event = {
            seq: nextSeq,
            type: "hit",
            itemId: item.id,
            itemLabel: item.label,
            latencyMs: CACHE_HIT_MS,
            evictedLabel: null,
            message: `Hit: ${item.label} served from Cache in ${CACHE_HIT_MS} ms (24x faster).`
        }

        return {
            ...state,
            seq: nextSeq,
            slots: nextSlots,
            hits: state.hits + 1,
            totalLatencyMs: state.totalLatencyMs + CACHE_HIT_MS,
            lastEvent: event,
            history: [{ id: `c-${nextSeq}`, ...event }, ...state.history].slice(0, 4)
        }
    }

    // CACHE MISS: fetch from slow disk and insert at front; evict LRU if full
    const newSlot = { id: item.id, label: item.label, tag: item.tag, hits: 0 }
    let nextSlots = [newSlot, ...state.slots]
    let evictedLabel = null

    if (nextSlots.length > state.capacity) {
        const evicted = nextSlots[nextSlots.length - 1]
        evictedLabel = evicted.label
        nextSlots = nextSlots.slice(0, state.capacity)
    }

    const event = {
        seq: nextSeq,
        type: "miss",
        itemId: item.id,
        itemLabel: item.label,
        latencyMs: CACHE_MISS_MS,
        evictedLabel,
        message: evictedLabel
            ? `Miss: ${item.label} loaded from Disk (${CACHE_MISS_MS} ms) · Evicted ${evictedLabel}.`
            : `Miss: ${item.label} loaded from Disk (${CACHE_MISS_MS} ms) and cached.`
    }

    return {
        ...state,
        seq: nextSeq,
        slots: nextSlots,
        misses: state.misses + 1,
        totalLatencyMs: state.totalLatencyMs + CACHE_MISS_MS,
        lastEvent: event,
        history: [{ id: `c-${nextSeq}`, ...event }, ...state.history].slice(0, 4)
    }
}

export function runCacheBurst(state, sequence = CACHE_BURSTS.popular) {
    let next = state
    for (const id of sequence) {
        next = requestCacheItem(next, id)
    }
    return next
}

export function resizeCacheCapacity(state, newCapacity) {
    const safeCap = Math.max(2, Math.min(4, Math.round(Number(newCapacity) || 3)))
    const trimmed = state.slots.slice(0, safeCap)
    return {
        ...state,
        capacity: safeCap,
        slots: trimmed
    }
}

export function getCacheStats(state) {
    const total = state.hits + state.misses
    const hitRatePct = total > 0 ? Math.round((state.hits / total) * 100) : 0
    const avgLatencyMs = total > 0 ? Math.round(state.totalLatencyMs / total) : 0
    const uncachedTotalMs = total * CACHE_MISS_MS
    const timeSavedMs = Math.max(0, uncachedTotalMs - state.totalLatencyMs)
    const speedupFactor = state.totalLatencyMs > 0
        ? Number((uncachedTotalMs / state.totalLatencyMs).toFixed(1))
        : 1

    return {
        total,
        hitRatePct,
        avgLatencyMs,
        uncachedTotalMs,
        timeSavedMs,
        speedupFactor
    }
}

// (2) SERVER LOAD BALANCER
export const BALANCER_STRATEGIES = [
    {
        id: "no-balancer",
        label: "No Balancer",
        ruleNote: "All traffic hits Server 1 only."
    },
    {
        id: "round-robin",
        label: "Take Turns",
        ruleNote: "Rotates traffic 1 → 2 → 3 evenly."
    },
    {
        id: "least-busy",
        label: "Pick Quietest",
        ruleNote: "Sends to the shortest queue."
    }
]

export const MAX_SERVER_QUEUE = 6

export function createBalancerState({ strategy = "round-robin" } = {}) {
    const validStrategy = BALANCER_STRATEGIES.some((s) => s.id === strategy) ? strategy : "round-robin"
    return {
        strategy: validStrategy,
        rrCursor: 0,
        seq: 0,
        servedCount: 0,
        droppedCount: 0,
        lastTargetId: null,
        lastBatchEvents: [],
        lastActionNote: "Send traffic or tap any server node to test failover.",
        servers: [
            { id: "S1", name: "Server 1", online: true, slow: false, queue: 0, served: 0, dropped: 0 },
            { id: "S2", name: "Server 2", online: true, slow: false, queue: 0, served: 0, dropped: 0 },
            { id: "S3", name: "Server 3", online: true, slow: false, queue: 0, served: 0, dropped: 0 }
        ]
    }
}

function pickTargetServer(state) {
    const onlineServers = state.servers.filter((s) => s.online)
    if (onlineServers.length === 0) {
        return { targetIndex: -1, nextCursor: state.rrCursor }
    }

    if (state.strategy === "no-balancer") {
        // Without a balancer, traffic is hardcoded to Server 1 even when overloaded or offline.
        return { targetIndex: 0, nextCursor: state.rrCursor }
    }

    if (state.strategy === "round-robin") {
        const picked = onlineServers[state.rrCursor % onlineServers.length]
        const targetIndex = state.servers.findIndex((s) => s.id === picked.id)
        return {
            targetIndex,
            nextCursor: (state.rrCursor + 1) % Math.max(1, onlineServers.length)
        }
    }

    // least-busy: choose online server with smallest queue (tie-break healthy speed first)
    let best = onlineServers[0]
    for (let i = 1; i < onlineServers.length; i++) {
        const candidate = onlineServers[i]
        if (candidate.queue < best.queue) {
            best = candidate
        }
        else if (candidate.queue === best.queue && best.slow && !candidate.slow) {
            best = candidate
        }
    }
    const targetIndex = state.servers.findIndex((s) => s.id === best.id)
    return { targetIndex, nextCursor: state.rrCursor }
}

export function sendBalancerVisitors(state, count = 1) {
    const visitors = Math.max(1, Math.min(12, Math.floor(Number(count) || 1)))
    let nextSeq = state.seq || 0
    const current = {
        ...state,
        servers: state.servers.map((s) => ({ ...s }))
    }

    let added = 0
    let dropped = 0
    let lastTargetName = null
    const batchEvents = []

    for (let i = 0; i < visitors; i++) {
        nextSeq += 1
        const { targetIndex, nextCursor } = pickTargetServer(current)
        current.rrCursor = nextCursor

        if (targetIndex < 0) {
            current.droppedCount += 1
            dropped += 1
            batchEvents.push({ id: `pkt-${nextSeq}`, serverId: "S1", dropped: true, delayIndex: i })
            continue
        }

        const srv = current.servers[targetIndex]
        lastTargetName = srv.name

        if (!srv.online || srv.queue >= MAX_SERVER_QUEUE) {
            srv.dropped += 1
            current.droppedCount += 1
            dropped += 1
            batchEvents.push({ id: `pkt-${nextSeq}`, serverId: srv.id, dropped: true, delayIndex: i })
        }
        else {
            srv.queue += 1
            added += 1
            batchEvents.push({ id: `pkt-${nextSeq}`, serverId: srv.id, dropped: false, delayIndex: i })
        }
    }

    let note = ""
    if (dropped > 0 && added === 0) {
        note = current.strategy === "no-balancer" && !current.servers[0].online
            ? "Dropped: Server 1 is offline with No Balancer active."
            : "Dropped: Queue full (6/6). Add servers or spread traffic."
    }
    else if (dropped > 0) {
        note = `Sent ${visitors}: ${added} queued · ${dropped} dropped (queue full).`
    }
    else if (visitors === 1 && lastTargetName) {
        note = `Routed visitor to ${lastTargetName}.`
    }
    else {
        note = `Split ${visitors} visitors across active servers · 0 dropped.`
    }

    return {
        ...current,
        seq: nextSeq,
        lastTargetId: lastTargetName,
        lastBatchEvents: batchEvents,
        lastActionNote: note
    }
}

export function stepBalancerTick(state) {
    let newlyServed = 0
    const nextServers = state.servers.map((srv) => {
        if (!srv.online || srv.queue === 0) return srv
        const capacityPerTick = srv.slow ? 0.5 : 1
        const nextProgress = (srv.workProgress || 0) + capacityPerTick
        if (nextProgress >= 1) {
            newlyServed += 1
            return {
                ...srv,
                queue: Math.max(0, srv.queue - 1),
                served: srv.served + 1,
                workProgress: 0
            }
        }
        return {
            ...srv,
            workProgress: nextProgress
        }
    })

    return {
        ...state,
        servedCount: state.servedCount + newlyServed,
        servers: nextServers
    }
}

export function toggleBalancerServerOnline(state, serverId) {
    const nextServers = state.servers.map((srv) => {
        if (srv.id !== serverId) return srv
        const nextOnline = !srv.online
        return {
            ...srv,
            online: nextOnline,
            queue: nextOnline ? srv.queue : 0,
            workProgress: 0
        }
    })
    const target = nextServers.find((s) => s.id === serverId)
    return {
        ...state,
        servers: nextServers,
        lastActionNote: target?.online
            ? `${target.name} rebooted and back in rotation.`
            : `${target?.name} crashed — balancer reroutes around it.`
    }
}

export function toggleBalancerServerSlow(state, serverId) {
    const nextServers = state.servers.map((srv) => {
        if (srv.id !== serverId) return srv
        return {
            ...srv,
            slow: !srv.slow
        }
    })
    const target = nextServers.find((s) => s.id === serverId)
    return {
        ...state,
        servers: nextServers,
        lastActionNote: target?.slow
            ? `${target.name} slowed to 50% speed.`
            : `${target.name} restored to full speed.`
    }
}

export function runBalancerPreset(presetId) {
    if (presetId === "overload-s1") {
        const base = createBalancerState({ strategy: "no-balancer" })
        return {
            ...sendBalancerVisitors(base, 8),
            lastActionNote: "Demo: Server 1 overflowed & dropped 2 visitors while S2/S3 stayed empty."
        }
    }

    // "dodge-slow": Server 2 is slow and busy; Pick Quietest routes fresh spike around it
    let base = createBalancerState({ strategy: "least-busy" })
    base = toggleBalancerServerSlow(base, "S2")
    base.servers[1] = { ...base.servers[1], queue: 4 }
    return {
        ...sendBalancerVisitors(base, 6),
        lastActionNote: "Demo: Pick Quietest steered traffic to fast Servers 1 & 3, dodging slow Server 2."
    }
}

// (3) CONTACT FORM VALIDATION
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
