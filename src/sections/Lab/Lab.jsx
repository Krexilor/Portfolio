// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"

// COMPONENTS --------------------------------------------------------------------------------------------------------------------------------------|
import Reveal from "../../components/Common/Reveal/Reveal.jsx"

// UTILS -------------------------------------------------------------------------------------------------------------------------------------------|
import { simulateKeyDistribution, resolveRingKey, simulateLockContention } from "../../utils/systemsSim.js"

// STYLES ------------------------------------------------------------------------------------------------------------------------------------------|
import styles from "./Lab.module.css"

// CONSTANTS ---------------------------------------------------------------------------------------------------------------------------------------|
const WORKBENCH_MODES = [
    { id: "hash-ring", label: "Consistent Hash Ring" },
    { id: "lock-bench", label: "Concurrency & Locks" }
]

const SHARD_COLORS = [
    "#B8E986",
    "#7FD1AE",
    "#93C5FD",
    "#F3CD83",
    "#E4A5FF"
]

const INITIAL_NODES = ["shard-eu-1", "shard-us-2", "shard-ap-3"]

const CANDIDATE_NODES = ["shard-eu-1", "shard-us-2", "shard-ap-3", "shard-sa-4", "shard-uk-5"]

const SAMPLE_KEYS = [
    "session:8841",
    "auth:user_209",
    "feed:home_04",
    "quota:10.0.4.12",
    "blob:manifest",
    "metrics:cpu_90",
    "cache:locale_en",
    "queue:webhook_7",
    "token:refresh_2",
    "index:shard_key"
]

const LOCK_STRATEGIES = [
    {
        id: "coarse-mutex",
        label: "Coarse Global Mutex",
        note: "Single std::mutex guards the entire table. Simple correctness, but concurrent readers block each other as thread count climbs."
    },
    {
        id: "rw-lock",
        label: "Shared RW Lock",
        note: "Allows concurrent shared reads while exclusive writes serialize writers. Excels on read-heavy workloads before write contention spikes."
    },
    {
        id: "striped-locks",
        label: "16-Bucket Striped Locks",
        note: "Partitions keyspace across 16 independent locks so distinct buckets execute in parallel across cores."
    }
]

// BACKEND SYSTEMS LAB SECTION (CHAPTER 04) --------------------------------------------------------------------------------------------------------|
export default function Lab() {
    const [mode, setMode] = useState("hash-ring")
    const shouldReduceMotion = useReducedMotion()

    // Consistent Hash Ring State
    const [activeNodes, setActiveNodes] = useState(INITIAL_NODES)
    const [vnodesPerNode, setVnodesPerNode] = useState(6)
    const [probeKey, setProbeKey] = useState(SAMPLE_KEYS[0])

    // Concurrency & Lock Contention State
    const [threads, setThreads] = useState(8)
    const [writeRatio, setWriteRatio] = useState(25)
    const [lockStrategy, setLockStrategy] = useState("rw-lock")

    // Hash Ring Derived State
    const { ring, counts } = simulateKeyDistribution(activeNodes, SAMPLE_KEYS, vnodesPerNode)
    const probeMatch = resolveRingKey(ring, probeKey)
    const totalSampleKeys = SAMPLE_KEYS.length

    const toggleShardNode = (nodeId) => {
        setActiveNodes((prev) => {
            if (prev.includes(nodeId)) {
                return prev.length > 1 ? prev.filter((id) => id !== nodeId) : prev
            }
            return [...prev, nodeId]
        })
    }

    // Lock Contention Derived Comparison
    const benchResults = LOCK_STRATEGIES.map((strat) => ({
        ...strat,
        metrics: simulateLockContention({ threads, writeRatio, strategy: strat.id })
    }))
    const activeBench = benchResults.find((item) => item.id === lockStrategy) || benchResults[0]
    const maxOps = Math.max(...benchResults.map((item) => item.metrics.throughputOps), 1)

    const nodeColorMap = {}
    CANDIDATE_NODES.forEach((id, idx) => {
        nodeColorMap[id] = SHARD_COLORS[idx % SHARD_COLORS.length]
    })

    const polarToCartesian = (deg, radius) => {
        const rad = ((deg - 90) * Math.PI) / 180
        return {
            x: 110 + radius * Math.cos(rad),
            y: 110 + radius * Math.sin(rad)
        }
    }

    const probePoint = polarToCartesian(probeMatch.keyAngleDeg, 84)

    return (
        <section id = "lab" className = {`section ${styles.sectionContainer}`}>
            <div className = "container">
                <Reveal className = {styles.labHeader}>
                    <div className = {styles.labTitleCol}>
                        <span className = "eyebrow">Chapter 04 · Systems Lab</span>
                        <h2>Backend primitives &amp; concurrency.</h2>
                    </div>
                    <p className = {styles.labSubtitle}>
                        Interactive experiments modeling consistent hash partitioning and multi-threaded lock contention—independent of any single project.
                    </p>
                </Reveal>

                <Reveal delay = {0.06}>
                    <div className = {styles.workbench}>
                        <div className = {styles.workbenchBar}>
                            <div className = {styles.tabGroup} role = "tablist" aria-label = "Backend systems lab modes">
                                {WORKBENCH_MODES.map((item) => {
                                    const isActive = mode === item.id
                                    return (
                                        <button
                                            key = {item.id}
                                            type = "button"
                                            role = "tab"
                                            aria-selected = {isActive}
                                            className = {`${styles.tabBtn} ${isActive ? styles.tabBtnActive : ""}`}
                                            onClick = {() => setMode(item.id)}
                                        >
                                            {item.label}
                                        </button>
                                    )
                                })}
                            </div>

                            <span className = {styles.barTelemetry}>
                                {mode === "hash-ring"
                                    ? `${activeNodes.length}/${CANDIDATE_NODES.length} Shards Online · ${ring.length} Vnode Points · Target ${probeMatch.targetNode}`
                                    : `${threads} Threads · ${writeRatio}% Writes · ${activeBench.metrics.throughputOps.toLocaleString()} ops/s`}
                            </span>
                        </div>

                        <AnimatePresence mode = "wait">
                            {mode === "hash-ring" && (
                                <motion.div
                                    key = "hash-ring"
                                    className = {styles.simGrid}
                                    initial = {shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                                    animate = {{ opacity: 1, y: 0 }}
                                    exit = {shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
                                    transition = {{ duration: 0.22 }}
                                >
                                    <div className = {styles.panel}>
                                        <div className = {styles.controlGroup}>
                                            <span className = {styles.controlLabel}>
                                                Active Backend Shards ({activeNodes.length} online — toggle nodes to observe key failover)
                                            </span>
                                            <div className = {styles.nodeToggleRow}>
                                                {CANDIDATE_NODES.map((nodeId) => {
                                                    const online = activeNodes.includes(nodeId)
                                                    return (
                                                        <button
                                                            key = {nodeId}
                                                            type = "button"
                                                            aria-pressed = {online}
                                                            className = {`${styles.nodeToggleBtn} ${online ? styles.nodeToggleOnline : ""}`}
                                                            onClick = {() => toggleShardNode(nodeId)}
                                                        >
                                                            <span
                                                                className = {styles.nodeSwatch}
                                                                style = {{ backgroundColor: online ? nodeColorMap[nodeId] : "var(--color-border-strong)" }}
                                                                aria-hidden = "true"
                                                            />
                                                            <span>{nodeId}</span>
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>

                                        <div className = {styles.controlGroup}>
                                            <label htmlFor = "lab-vnodes" className = {styles.controlLabel}>
                                                Virtual Nodes per Shard: {vnodesPerNode} ({ring.length} total ring points)
                                            </label>
                                            <input
                                                id = "lab-vnodes"
                                                type = "range"
                                                min = "1"
                                                max = "12"
                                                value = {vnodesPerNode}
                                                onChange = {(event) => setVnodesPerNode(Number(event.target.value))}
                                                className = {styles.slider}
                                            />
                                        </div>

                                        <div className = {styles.controlGroup}>
                                            <label htmlFor = "lab-probe-key" className = {styles.controlLabel}>
                                                Route Partition Key (FNV-1a 32-bit clockwise lookup)
                                            </label>
                                            <input
                                                id = "lab-probe-key"
                                                type = "text"
                                                value = {probeKey}
                                                onChange = {(event) => setProbeKey(event.target.value)}
                                                className = {styles.cmdInput}
                                                placeholder = "session:8841"
                                            />
                                            <div className = {styles.presetRow}>
                                                {SAMPLE_KEYS.slice(0, 6).map((sample) => (
                                                    <button
                                                        key = {sample}
                                                        type = "button"
                                                        className = {`${styles.presetBtn} ${probeKey === sample ? styles.presetBtnActive : ""}`}
                                                        onClick = {() => setProbeKey(sample)}
                                                    >
                                                        {sample}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className = {styles.lookupReadout}>
                                            <div className = {styles.lookupCell}>
                                                <span className = {styles.statLabel}>Target Shard</span>
                                                <span
                                                    className = {styles.lookupValue}
                                                    style = {{ color: nodeColorMap[probeMatch.targetNode] || "var(--color-accent)" }}
                                                >
                                                    {probeMatch.targetNode}
                                                </span>
                                            </div>
                                            <div className = {styles.lookupCell}>
                                                <span className = {styles.statLabel}>Matched Vnode</span>
                                                <span className = {styles.lookupMono}>{probeMatch.matchedVnode}</span>
                                            </div>
                                            <div className = {styles.lookupCell}>
                                                <span className = {styles.statLabel}>Ring Position</span>
                                                <span className = {styles.lookupMono}>{probeMatch.keyAngleDeg.toFixed(1)}°</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className = {styles.panel}>
                                        <div className = {styles.subHeader}>
                                            <span className = {styles.subTitle}>Hash Ring Topology</span>
                                            <span className = {styles.subCount}>{totalSampleKeys} sample keys</span>
                                        </div>

                                        <div className = {styles.ringWrap}>
                                            <svg className = {styles.ringSvg} viewBox = "0 0 220 220" aria-label = "Consistent hash ring visualization">
                                                <circle cx = "110" cy = "110" r = "84" className = {styles.ringCircle} />
                                                <line
                                                    x1 = "110"
                                                    y1 = "110"
                                                    x2 = {probePoint.x}
                                                    y2 = {probePoint.y}
                                                    className = {styles.probeBeam}
                                                />
                                                <circle cx = "110" cy = "110" r = "4" className = {styles.ringCenterDot} />

                                                {ring.map((pt) => {
                                                    const pos = polarToCartesian(pt.angleDeg, 84)
                                                    return (
                                                        <circle
                                                            key = {`${pt.nodeId}-${pt.vnodeIndex}`}
                                                            cx = {pos.x}
                                                            cy = {pos.y}
                                                            r = "4"
                                                            fill = {nodeColorMap[pt.nodeId]}
                                                            stroke = "#101310"
                                                            strokeWidth = "1.5"
                                                        />
                                                    )
                                                })}

                                                <circle
                                                    cx = {probePoint.x}
                                                    cy = {probePoint.y}
                                                    r = "6.5"
                                                    className = {styles.probeMarker}
                                                />
                                            </svg>

                                            <div className = {styles.distList}>
                                                {activeNodes.map((nodeId) => {
                                                    const count = counts[nodeId] || 0
                                                    const pct = Math.round((count / totalSampleKeys) * 100)
                                                    return (
                                                        <div key = {nodeId} className = {styles.distRow}>
                                                            <div className = {styles.distHead}>
                                                                <span className = {styles.distName}>{nodeId}</span>
                                                                <span className = {styles.distMeta}>{count} keys · {pct}%</span>
                                                            </div>
                                                            <div className = {styles.barTrack}>
                                                                <div
                                                                    className = {styles.barFill}
                                                                    style = {{
                                                                        width: `${pct}%`,
                                                                        backgroundColor: nodeColorMap[nodeId]
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {mode === "lock-bench" && (
                                <motion.div
                                    key = "lock-bench"
                                    className = {styles.simGrid}
                                    initial = {shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                                    animate = {{ opacity: 1, y: 0 }}
                                    exit = {shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
                                    transition = {{ duration: 0.22 }}
                                >
                                    <div className = {styles.panel}>
                                        <div className = {styles.controlGroup}>
                                            <span className = {styles.controlLabel}>Synchronization Primitive</span>
                                            <div className = {styles.algoSwitch}>
                                                {LOCK_STRATEGIES.map((strat) => (
                                                    <button
                                                        key = {strat.id}
                                                        type = "button"
                                                        className = {`${styles.algoBtn} ${lockStrategy === strat.id ? styles.algoBtnActive : ""}`}
                                                        onClick = {() => setLockStrategy(strat.id)}
                                                    >
                                                        {strat.label}
                                                    </button>
                                                ))}
                                            </div>
                                            <p className = {styles.strategyNote}>{activeBench.note}</p>
                                        </div>

                                        <div className = {styles.sliderPair}>
                                            <div className = {styles.controlGroup}>
                                                <label htmlFor = "lab-threads" className = {styles.controlLabel}>
                                                    Concurrent Worker Threads: {threads}
                                                </label>
                                                <input
                                                    id = "lab-threads"
                                                    type = "range"
                                                    min = "2"
                                                    max = "16"
                                                    value = {threads}
                                                    onChange = {(event) => setThreads(Number(event.target.value))}
                                                    className = {styles.slider}
                                                />
                                            </div>

                                            <div className = {styles.controlGroup}>
                                                <label htmlFor = "lab-writes" className = {styles.controlLabel}>
                                                    Write Mutation Ratio: {writeRatio}%
                                                </label>
                                                <input
                                                    id = "lab-writes"
                                                    type = "range"
                                                    min = "5"
                                                    max = "80"
                                                    step = "5"
                                                    value = {writeRatio}
                                                    onChange = {(event) => setWriteRatio(Number(event.target.value))}
                                                    className = {styles.slider}
                                                />
                                            </div>
                                        </div>

                                        <div className = {styles.statsRow}>
                                            <div className = {styles.statCell}>
                                                <span className = {styles.statLabel}>Throughput</span>
                                                <span className = {`${styles.statVal} ${styles.statusOk}`}>
                                                    {activeBench.metrics.throughputOps.toLocaleString()} ops/s
                                                </span>
                                            </div>
                                            <div className = {styles.statCell}>
                                                <span className = {styles.statLabel}>Lock Contention</span>
                                                <span className = {styles.statVal}>{activeBench.metrics.contentionPct}%</span>
                                            </div>
                                            <div className = {styles.statCell}>
                                                <span className = {styles.statLabel}>p50 Latency</span>
                                                <span className = {styles.statVal}>{activeBench.metrics.p50Ms} ms</span>
                                            </div>
                                            <div className = {styles.statCell}>
                                                <span className = {styles.statLabel}>p99 Tail</span>
                                                <span className = {`${styles.statVal} ${activeBench.metrics.p99Ms > 8 ? styles.statusWarn : ""}`}>
                                                    {activeBench.metrics.p99Ms} ms
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className = {styles.panel}>
                                        <div className = {styles.subHeader}>
                                            <span className = {styles.subTitle}>Strategy Comparison ({threads} threads · {writeRatio}% writes)</span>
                                            <span className = {styles.subCount}>Throughput scaling</span>
                                        </div>

                                        <div className = {styles.compareList}>
                                            {benchResults.map((item) => {
                                                const widthPct = Math.round((item.metrics.throughputOps / maxOps) * 100)
                                                const isCurrent = item.id === lockStrategy
                                                return (
                                                    <div
                                                        key = {item.id}
                                                        className = {`${styles.compareRow} ${isCurrent ? styles.compareRowActive : ""}`}
                                                    >
                                                        <div className = {styles.distHead}>
                                                            <span className = {styles.distName}>{item.label}</span>
                                                            <span className = {styles.distMeta}>
                                                                {item.metrics.throughputOps.toLocaleString()} ops/s · p99 {item.metrics.p99Ms} ms
                                                            </span>
                                                        </div>
                                                        <div className = {styles.barTrack}>
                                                            <div
                                                                className = {styles.barFill}
                                                                style = {{
                                                                    width: `${widthPct}%`,
                                                                    backgroundColor: isCurrent ? "var(--color-accent)" : "var(--color-border-strong)"
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </div>
                </Reveal>
            </div>
        </section>
    )
}
