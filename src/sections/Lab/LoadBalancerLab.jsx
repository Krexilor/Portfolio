// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { useEffect, useState } from "react"
import { useReducedMotion } from "motion/react"

// UTILS -------------------------------------------------------------------------------------------------------------------------------------------|
import {
    BALANCER_STRATEGIES,
    MAX_SERVER_QUEUE,
    createBalancerState,
    runBalancerPreset,
    sendBalancerVisitors,
    stepBalancerTick,
    toggleBalancerServerOnline,
    toggleBalancerServerSlow
} from "../../utils/systemsSim.js"

// STYLES ------------------------------------------------------------------------------------------------------------------------------------------|
import styles from "./Lab.module.css"

// SVG BEZIER PATHS FROM SWITCHBOARD TO SERVER NODES -----------------------------------------------------------------------------------------------|
const SERVER_WIRE_PATHS_H = {
    S1: "M 4 150 C 90 150, 105 46, 196 46",
    S2: "M 4 150 L 196 150",
    S3: "M 4 150 C 90 150, 105 254, 196 254"
}

const SERVER_WIRE_PATH_V = "M 24 4 L 24 42"

const TARGET_LABEL_MAP = {
    "Server 1": "S1",
    "Server 2": "S2",
    "Server 3": "S3"
}

// LAB 2: SERVER LOAD BALANCER (ANIMATED SWITCHBOARD & LIVE SERVER RACKS) --------------------------------------------------------------------------|
export default function LoadBalancerLab({ onSummaryChange }) {
    const [autoStream, setAutoStream] = useState(false)
    const [sim, setSim] = useState(() => sendBalancerVisitors(createBalancerState({ strategy: "round-robin" }), 3))
    const shouldReduceMotion = useReducedMotion()

    const onlineCount = sim.servers.filter((srv) => srv.online).length
    const totalQueued = sim.servers.reduce((sum, srv) => sum + srv.queue, 0)
    const activeStrategy = BALANCER_STRATEGIES.find((s) => s.id === sim.strategy) || BALANCER_STRATEGIES[0]
    const lastServerKey = TARGET_LABEL_MAP[sim.lastTargetId] || null

    useEffect(() => {
        if (!onSummaryChange) return
        onSummaryChange(`Up: ${onlineCount}/3 · Queued: ${totalQueued} · Served: ${sim.servedCount} · Dropped: ${sim.droppedCount}`)
    }, [onlineCount, totalQueued, sim.servedCount, sim.droppedCount, onSummaryChange])

    useEffect(() => {
        const timer = window.setInterval(() => {
            setSim((prev) => {
                const afterWork = stepBalancerTick(prev)
                return autoStream ? sendBalancerVisitors(afterWork, 1) : afterWork
            })
        }, 550)
        return () => window.clearInterval(timer)
    }, [autoStream])

    const handleStrategyChange = (strategyId) => {
        const strat = BALANCER_STRATEGIES.find((s) => s.id === strategyId)
        setSim((prev) => ({
            ...prev,
            strategy: strategyId,
            lastActionNote: `Rule: ${strat?.label} — ${strat?.ruleNote}`
        }))
    }

    const handlePreset = (presetId) => {
        setAutoStream(false)
        setSim(runBalancerPreset(presetId))
    }

    const handleReset = () => {
        setAutoStream(false)
        setSim((prev) => createBalancerState({ strategy: prev.strategy }))
    }

    return (
        <div className = {styles.labBody}>
            {/* Concise 1-line Header + Traffic Controls */}
            <div className = {styles.guideRow}>
                <div className = {styles.guideCopy}>
                    <h3 className = {styles.guideTitle}>Live Traffic Switchboard</h3>
                    <p className = {styles.guideDesc}>
                        Split visitors across healthy servers—or crash a node to watch traffic reroute.
                    </p>
                </div>

                <div className = {styles.scenarioGroup} aria-label = "Send visitor traffic">
                    <div className = {styles.scenarioButtons}>
                        <button
                            type = "button"
                            className = {styles.primaryActionBtn}
                            onClick = {() => setSim((prev) => sendBalancerVisitors(prev, 1))}
                        >
                            +1 Visitor
                        </button>
                        <button
                            type = "button"
                            className = {styles.secondaryActionBtn}
                            onClick = {() => setSim((prev) => sendBalancerVisitors(prev, 6))}
                        >
                            Crowd (+6)
                        </button>
                        <button
                            type = "button"
                            aria-pressed = {autoStream}
                            className = {`${styles.scenarioBtn} ${autoStream ? styles.scenarioBtnActive : ""}`}
                            onClick = {() => setAutoStream((v) => !v)}
                        >
                            {autoStream ? "Stream: On" : "Stream: Off"}
                        </button>
                        <button type = "button" className = {styles.ghostActionBtn} onClick = {handleReset}>
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            {/* LIVE TOPOLOGY SWITCHBOARD STAGE */}
            <div className = {styles.switchboardStage} data-testid = "balancer-topology">
                {/* Left Node: Traffic Gateway + Routing Switch */}
                <div className = {styles.routerNode}>
                    <div className = {styles.nodeTop}>
                        <span className = {styles.nodeTag}>GATEWAY</span>
                        <span className = {styles.nodeSpeedTag}>{activeStrategy.label}</span>
                    </div>
                    <div className = {styles.nodeTitle}>Load Balancer</div>
                    <div className = {styles.routerPorts} aria-hidden = "true">
                        {sim.servers.map((srv) => {
                            const disabled = !srv.online || (sim.strategy === "no-balancer" && srv.id !== "S1")
                            const targeted = lastServerKey === srv.id && srv.online
                            return (
                                <span
                                    key = {srv.id}
                                    className = {`${styles.portChip} ${targeted ? styles.portChipActive : ""} ${disabled ? styles.portChipOff : ""}`}
                                >
                                    {srv.id}
                                </span>
                            )
                        })}
                    </div>
                    <p className = {styles.routerNote} role = "status" data-testid = "balancer-note">
                        {sim.lastActionNote}
                    </p>
                </div>

                {/* Center SVG Switchboard Wires + Flying Packets */}
                <div className = {styles.wireCanvasWrap} aria-hidden = "true">
                    {/* Horizontal Wires (Desktop/Tablet) */}
                    <svg className = {styles.wireSvgH} viewBox = "0 0 200 300" preserveAspectRatio = "none">
                        {sim.servers.map((srv) => {
                            const d = SERVER_WIRE_PATHS_H[srv.id]
                            const isDimmed = sim.strategy === "no-balancer" && srv.id !== "S1"
                            const isTargeted = lastServerKey === srv.id && srv.online
                            let wireClass = styles.wireBase
                            if (!srv.online) wireClass = styles.wireBroken
                            else if (isDimmed) wireClass = styles.wireDimmed
                            else if (srv.slow) wireClass = styles.wireSlowActive
                            else if (isTargeted) wireClass = styles.wireFastActive

                            return <path key = {srv.id} d = {d} className = {wireClass} />
                        })}

                        {!shouldReduceMotion && sim.lastBatchEvents.map((pkt) => (
                            <circle
                                key = {pkt.id}
                                r = "5"
                                className = {pkt.dropped ? styles.packetOrbDrop : styles.packetOrbHit}
                                style = {{
                                    offsetPath: `path("${SERVER_WIRE_PATHS_H[pkt.serverId] || SERVER_WIRE_PATHS_H.S1}")`,
                                    animationDelay: `${pkt.delayIndex * 55}ms`
                                }}
                            />
                        ))}
                    </svg>

                    {/* Vertical Bus Trunk (Mobile <640px) */}
                    <svg className = {styles.wireSvgV} viewBox = "0 0 48 46">
                        <path
                            d = {SERVER_WIRE_PATH_V}
                            className = {onlineCount > 0 ? styles.wireFastActive : styles.wireBroken}
                        />
                        <polyline
                            points = "18,35 24,42 30,35"
                            className = {`${styles.wireArrow} ${onlineCount > 0 ? styles.wireArrowHit : ""}`}
                        />
                        {!shouldReduceMotion && sim.lastBatchEvents.slice(0, 3).map((pkt) => (
                            <circle
                                key = {`v-${pkt.id}`}
                                r = "4"
                                className = {pkt.dropped ? styles.packetOrbDrop : styles.packetOrbHit}
                                style = {{
                                    offsetPath: `path("${SERVER_WIRE_PATH_V}")`,
                                    animationDelay: `${pkt.delayIndex * 65}ms`
                                }}
                            />
                        ))}
                    </svg>
                </div>

                {/* Right Column: 3 Live Interactive Server Racks */}
                <div className = {styles.serverStack} data-testid = "balancer-servers">
                    {sim.servers.map((srv) => {
                        const isFull = srv.queue >= MAX_SERVER_QUEUE
                        let statusText = "READY"
                        let cardClass = styles.rackCard
                        if (!srv.online) {
                            statusText = "OFFLINE"
                            cardClass = `${styles.rackCard} ${styles.serverCardOffline}`
                        }
                        else if (isFull) {
                            statusText = "FULL 6/6"
                            cardClass = `${styles.rackCard} ${styles.serverCardFull}`
                        }
                        else if (srv.slow) {
                            statusText = "50% SPEED"
                            cardClass = `${styles.rackCard} ${styles.serverCardSlow}`
                        }
                        else if (srv.queue > 0) {
                            statusText = "WORKING"
                            cardClass = `${styles.rackCard} ${styles.serverCardBusy}`
                        }

                        return (
                            <div key = {srv.id} className = {cardClass}>
                                <div className = {styles.rackInfo}>
                                    <div className = {styles.rackTitleRow}>
                                        <span className = {styles.serverName}>{srv.name}</span>
                                        <span className = {styles.serverStatus}>{statusText}</span>
                                    </div>
                                    <div className = {styles.queueCells} aria-label = {`${srv.name} queue ${srv.queue} of ${MAX_SERVER_QUEUE}`}>
                                        {Array.from({ length: MAX_SERVER_QUEUE }).map((_, idx) => (
                                            <span
                                                key = {idx}
                                                className = {
                                                    idx < srv.queue
                                                        ? isFull
                                                            ? styles.queueDotFull
                                                            : srv.slow
                                                                ? styles.queueDotSlow
                                                                : styles.queueDotActive
                                                        : styles.queueDotEmpty
                                                }
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className = {styles.rackStats}>
                                    <span>In line: {srv.queue}/{MAX_SERVER_QUEUE}</span>
                                    <span>Served: {srv.served}</span>
                                </div>

                                <div className = {styles.rackControls}>
                                    <button
                                        type = "button"
                                        aria-label = {`${srv.online ? "Crash" : "Reboot"} ${srv.name}`}
                                        className = {styles.miniActionBtn}
                                        onClick = {() => setSim((prev) => toggleBalancerServerOnline(prev, srv.id))}
                                    >
                                        {srv.online ? "Crash" : "Reboot"}
                                    </button>
                                    <button
                                        type = "button"
                                        disabled = {!srv.online}
                                        aria-label = {`${srv.slow ? "Fix speed" : "Slow down"} ${srv.name}`}
                                        className = {`${styles.miniActionBtn} ${srv.slow ? styles.miniActionBtnWarn : ""}`}
                                        onClick = {() => setSim((prev) => toggleBalancerServerSlow(prev, srv.id))}
                                    >
                                        {srv.slow ? "Fix" : "Slow"}
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* BOTTOM DECK: STRATEGY SWITCHER + 1-CLICK VISUAL DEMOS + 4 STATS */}
            <div className = {styles.simGrid}>
                <div className = {styles.panel}>
                    <div className = {styles.subHeader}>
                        <span className = {styles.subTitle}>Routing Rule</span>
                        <span className = {styles.subCount}>{activeStrategy.ruleNote}</span>
                    </div>

                    <div className = {styles.algoSwitch} role = "radiogroup" aria-label = "Load balancer routing rule">
                        {BALANCER_STRATEGIES.map((strat) => {
                            const selected = sim.strategy === strat.id
                            return (
                                <button
                                    key = {strat.id}
                                    type = "button"
                                    role = "radio"
                                    aria-checked = {selected}
                                    className = {`${styles.algoBtn} ${selected ? styles.algoBtnActive : ""}`}
                                    onClick = {() => handleStrategyChange(strat.id)}
                                >
                                    {strat.label}
                                </button>
                            )
                        })}
                    </div>

                    <div className = {styles.demoStrip}>
                        <span className = {styles.demoStripLabel}>Instant demos:</span>
                        <button
                            type = "button"
                            className = {styles.scenarioBtn}
                            onClick = {() => handlePreset("overload-s1")}
                        >
                            Demo: Overload S1
                        </button>
                        <button
                            type = "button"
                            className = {styles.scenarioBtn}
                            onClick = {() => handlePreset("dodge-slow")}
                        >
                            Demo: Dodge Slow Node
                        </button>
                    </div>
                </div>

                <div className = {styles.panel}>
                    <div className = {styles.subHeader}>
                        <span className = {styles.subTitle}>Live Cluster Scoreboard</span>
                        <span className = {styles.subCount}>{onlineCount} / 3 servers online</span>
                    </div>

                    <div className = {styles.statsRow}>
                        <div className = {styles.statCell}>
                            <span className = {styles.statLabel}>Served</span>
                            <span className = {`${styles.statVal} ${styles.statusOk}`}>{sim.servedCount}</span>
                        </div>
                        <div className = {styles.statCell}>
                            <span className = {styles.statLabel}>Dropped</span>
                            <span className = {`${styles.statVal} ${sim.droppedCount > 0 ? styles.statusErr : ""}`}>
                                {sim.droppedCount}
                            </span>
                        </div>
                        <div className = {styles.statCell}>
                            <span className = {styles.statLabel}>Queued</span>
                            <span className = {styles.statVal}>{totalQueued}</span>
                        </div>
                        <div className = {styles.statCell}>
                            <span className = {styles.statLabel}>Up</span>
                            <span className = {styles.statVal}>{onlineCount} / 3</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
