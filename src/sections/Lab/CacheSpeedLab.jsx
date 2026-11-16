// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { useEffect, useState } from "react"
import { useReducedMotion } from "motion/react"

// UTILS -------------------------------------------------------------------------------------------------------------------------------------------|
import {
    CACHE_BURSTS,
    CACHE_HIT_MS,
    CACHE_ITEMS,
    CACHE_MISS_MS,
    createCacheSimState,
    getCacheStats,
    requestCacheItem,
    resizeCacheCapacity,
    runCacheBurst
} from "../../utils/systemsSim.js"

// STYLES ------------------------------------------------------------------------------------------------------------------------------------------|
import styles from "./Lab.module.css"

// SVG PATHS FOR PACKET TRAVEL ---------------------------------------------------------------------------------------------------------------------|
const HIT_PATH_H = "M 6 24 L 114 24"
const MISS_PATH_H = "M 6 24 C 34 6, 86 6, 114 24"

// LAB 1: CACHE SPEED LAB (ANIMATED PIPELINE + SPEED RACE) -----------------------------------------------------------------------------------------|
export default function CacheSpeedLab({ onSummaryChange }) {
    const [sim, setSim] = useState(() => createCacheSimState({ capacity: 3 }))
    const shouldReduceMotion = useReducedMotion()
    const stats = getCacheStats(sim)

    useEffect(() => {
        if (!onSummaryChange) return
        if (stats.total === 0) {
            onSummaryChange(`Shelf: 0/${sim.capacity} used · Tap any item`)
            return
        }
        onSummaryChange(`Hit Rate: ${stats.hitRatePct}% · Avg: ${stats.avgLatencyMs} ms · ${stats.speedupFactor}x faster`)
    }, [stats.total, stats.hitRatePct, stats.avgLatencyMs, stats.speedupFactor, sim.capacity, onSummaryChange])

    const handleFetchItem = (itemId) => {
        setSim((prev) => requestCacheItem(prev, itemId))
    }

    const handleRunBurst = (burstKey) => {
        setSim((prev) => runCacheBurst(prev, CACHE_BURSTS[burstKey]))
    }

    const handleResize = (cap) => {
        setSim((prev) => resizeCacheCapacity(prev, cap))
    }

    const handleReset = () => {
        setSim((prev) => createCacheSimState({ capacity: prev.capacity }))
    }

    const cachedIds = new Set(sim.slots.map((slot) => slot.id))
    const isHit = sim.lastEvent.type === "hit"
    const isMiss = sim.lastEvent.type === "miss"

    // Speed race bar scaling (GPU transform ratio 0..1)
    const maxRaceMs = Math.max(CACHE_MISS_MS, stats.uncachedTotalMs)
    const cachedBarScale = stats.total > 0 ? Math.max(0.05, Math.min(1, sim.totalLatencyMs / maxRaceMs)) : 0
    const uncachedBarScale = stats.total > 0 ? 1 : 0

    return (
        <div className = {styles.labBody}>
            {/* Concise 1-line Header + Quick Action Controls */}
            <div className = {styles.guideRow}>
                <div className = {styles.guideCopy}>
                    <h3 className = {styles.guideTitle}>Fast Cache vs. Slow Disk</h3>
                    <p className = {styles.guideDesc}>
                        Cache answers in <strong>5 ms</strong>. Uncached reads travel to Disk (<strong>120 ms</strong>).
                    </p>
                </div>

                <div className = {styles.scenarioGroup} aria-label = "Cache presets and size">
                    <div className = {styles.scenarioButtons}>
                        <button
                            type = "button"
                            className = {styles.primaryActionBtn}
                            onClick = {() => handleRunBurst("popular")}
                        >
                            Popular Rush (+8)
                        </button>
                        <button
                            type = "button"
                            className = {styles.secondaryActionBtn}
                            onClick = {() => handleRunBurst("random")}
                        >
                            Random Mix (+8)
                        </button>
                        <button
                            type = "button"
                            className = {styles.ghostActionBtn}
                            onClick = {handleReset}
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            {/* LIVE ANIMATED PIPELINE STAGE */}
            <div className = {styles.pipelineStage} data-testid = "cache-pipeline">
                {/* Node 1: App Origin */}
                <div className = {`${styles.stageNode} ${isHit ? styles.stageNodeHit : isMiss ? styles.stageNodeMiss : ""}`}>
                    <div className = {styles.nodeTop}>
                        <span className = {styles.nodeTag}>ORIGIN</span>
                        <span className = {styles.nodeSpeedTag}>
                            {sim.lastEvent.latencyMs ? `${sim.lastEvent.latencyMs} ms` : "IDLE"}
                        </span>
                    </div>
                    <div className = {styles.nodeTitle}>Your App</div>
                    <div className = {styles.nodeSub}>
                        {sim.lastEvent.itemLabel ? `Asked: ${sim.lastEvent.itemLabel}` : "Waiting for tap"}
                    </div>
                </div>

                {/* Pipe A: App <-> Fast Cache (Short 5 ms path) */}
                <div className = {styles.pipeBridge} aria-hidden = "true">
                    <svg className = {styles.pipeSvgH} viewBox = "0 0 120 48">
                        <path
                            d = "M 6 18 L 114 18"
                            className = {`${styles.wireBase} ${isHit || isMiss ? styles.wireFastActive : ""}`}
                        />
                        <polyline points = "107,13 114,18 107,23" className = {`${styles.wireArrow} ${isHit || isMiss ? styles.wireArrowHit : ""}`} />
                        <path
                            d = "M 114 32 L 6 32"
                            className = {`${styles.wireBase} ${isHit ? styles.wireFastReturn : isMiss ? styles.wireMissReturn : ""}`}
                        />
                        <polyline points = "13,27 6,32 13,37" className = {`${styles.wireArrow} ${isHit ? styles.wireArrowHit : isMiss ? styles.wireArrowMiss : ""}`} />
                        {!shouldReduceMotion && (isHit || isMiss) && (
                            <circle
                                key = {`h-${sim.lastEvent.seq}`}
                                r = "4.5"
                                className = {isHit ? styles.packetOrbHit : styles.packetOrbMiss}
                                style = {{ offsetPath: `path("${HIT_PATH_H}")` }}
                            />
                        )}
                    </svg>
                    <svg className = {styles.pipeSvgV} viewBox = "0 0 48 40">
                        <path
                            d = "M 24 4 L 24 34"
                            className = {`${styles.wireBase} ${isHit ? styles.wireFastActive : isMiss ? styles.wireMissActive : ""}`}
                        />
                        <polyline points = "19,28 24,35 29,28" className = {`${styles.wireArrow} ${isHit ? styles.wireArrowHit : isMiss ? styles.wireArrowMiss : ""}`} />
                    </svg>
                    <span className = {`${styles.pipeBadge} ${isHit ? styles.pipeBadgeHit : ""}`}>
                        {isHit ? `${CACHE_HIT_MS} ms` : "Lookup"}
                    </span>
                </div>

                {/* Node 2: Fast Cache Rack (Live LRU Cartridges inside stage) */}
                <div className = {`${styles.cacheRackNode} ${isHit ? styles.cacheRackHit : ""}`}>
                    <div className = {styles.nodeTop}>
                        <span className = {styles.nodeTitle}>Fast Cache ({CACHE_HIT_MS} ms)</span>
                        <div className = {styles.shelfSizer} role = "group" aria-label = "Cache shelf capacity">
                            {[2, 3, 4].map((cap) => (
                                <button
                                    key = {cap}
                                    type = "button"
                                    aria-pressed = {sim.capacity === cap}
                                    className = {`${styles.sizeBtn} ${sim.capacity === cap ? styles.sizeBtnActive : ""}`}
                                    onClick = {() => handleResize(cap)}
                                >
                                    {cap}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className = {styles.rackCartridges} data-testid = "cache-shelf">
                        {Array.from({ length: sim.capacity }).map((_, slotIdx) => {
                            const entry = sim.slots[slotIdx]
                            const isHot = slotIdx === 0 && Boolean(entry)
                            const isNextOut = Boolean(entry) && sim.slots.length === sim.capacity && slotIdx === sim.capacity - 1
                            return (
                                <div
                                    key = {slotIdx}
                                    className = {`${styles.cartridge} ${entry ? styles.cartridgeFilled : styles.cartridgeEmpty} ${isHot && isHit ? styles.cartridgeHotPulse : ""} ${isNextOut ? styles.cartridgeNextOut : ""}`}
                                >
                                    <span className = {styles.cartridgeName}>
                                        {entry ? entry.label : `Slot ${slotIdx + 1}`}
                                    </span>
                                    <span className = {styles.cartridgeState}>
                                        {!entry
                                            ? "Empty"
                                            : isHot
                                                ? `HOT · ${entry.hits}x`
                                                : isNextOut
                                                    ? "NEXT OUT"
                                                    : `${entry.hits}x`}
                                    </span>
                                </div>
                            )
                        })}
                    </div>

                    {sim.lastEvent.evictedLabel && (
                        <div className = {styles.evictNotice}>
                            Shelf full · Bumped &ldquo;{sim.lastEvent.evictedLabel}&rdquo;
                        </div>
                    )}
                </div>

                {/* Pipe B: Cache <-> Slow Disk (Long 120 ms path) */}
                <div className = {styles.pipeBridge} aria-hidden = "true">
                    <svg className = {styles.pipeSvgH} viewBox = "0 0 120 48">
                        <path
                            d = {MISS_PATH_H}
                            className = {`${styles.wireSlowBase} ${isMiss ? styles.wireSlowActive : ""}`}
                        />
                        {!shouldReduceMotion && isMiss && (
                            <circle
                                key = {`m-${sim.lastEvent.seq}`}
                                r = "4.5"
                                className = {styles.packetOrbMiss}
                                style = {{ offsetPath: `path("${MISS_PATH_H}")` }}
                            />
                        )}
                    </svg>
                    <svg className = {styles.pipeSvgV} viewBox = "0 0 48 44">
                        <path
                            d = "M 24 4 L 24 40"
                            className = {`${styles.wireSlowBase} ${isMiss ? styles.wireSlowActive : ""}`}
                        />
                    </svg>
                    <span className = {`${styles.pipeBadge} ${isMiss ? styles.pipeBadgeMiss : ""}`}>
                        {isMiss ? `${CACHE_MISS_MS} ms` : "Disk path"}
                    </span>
                </div>

                {/* Node 3: Slow Disk Cylinder */}
                <div className = {`${styles.stageNode} ${isMiss ? styles.stageNodeDiskActive : styles.stageNodeDiskIdle}`}>
                    <div className = {styles.nodeTop}>
                        <span className = {styles.nodeTag}>DATABASE</span>
                        <span className = {styles.diskIcon} aria-hidden = "true">
                            <svg width = "22" height = "22" viewBox = "0 0 24 24" fill = "none">
                                <ellipse cx = "12" cy = "6" rx = "8" ry = "3" stroke = "currentColor" strokeWidth = "1.6" />
                                <path d = "M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" stroke = "currentColor" strokeWidth = "1.6" />
                                <path d = "M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" stroke = "currentColor" strokeWidth = "1.6" />
                            </svg>
                        </span>
                    </div>
                    <div className = {styles.nodeTitle}>Slow Disk ({CACHE_MISS_MS} ms)</div>
                    <div className = {styles.nodeSub}>
                        {isMiss ? "Read from disk" : isHit ? "Skipped!" : "24x slower"}
                    </div>
                </div>
            </div>

            {/* INTERACTIVE ITEM DOCK + LIVE SPEED RACE */}
            <div className = {styles.simGrid}>
                {/* Left: 6 Tappable App Items */}
                <div className = {styles.panel}>
                    <div className = {styles.subHeader}>
                        <span className = {styles.subTitle}>Tap an Item to Request It</span>
                        <span className = {styles.subCount} data-testid = "cache-outcome">{sim.lastEvent.message}</span>
                    </div>

                    <div className = {styles.itemPickerGrid} data-testid = "cache-item-grid">
                        {CACHE_ITEMS.map((item) => {
                            const inCache = cachedIds.has(item.id)
                            return (
                                <button
                                    key = {item.id}
                                    type = "button"
                                    className = {`${styles.itemTile} ${inCache ? styles.itemTileCached : ""}`}
                                    onClick = {() => handleFetchItem(item.id)}
                                >
                                    <div className = {styles.itemTileTop}>
                                        <span className = {styles.itemTileTitle}>{item.label}</span>
                                        <span className = {inCache ? styles.itemSpeedFast : styles.itemSpeedSlow}>
                                            {inCache ? "5 ms" : "120 ms"}
                                        </span>
                                    </div>
                                    <span className = {styles.itemTileMeta}>
                                        {inCache ? "Cached · Fast Hit" : `On Disk · ${item.tag}`}
                                    </span>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Right: Live Speed Race Comparison + 4 Crisp Stats */}
                <div className = {styles.panel}>
                    <div className = {styles.subHeader}>
                        <span className = {styles.subTitle}>Total Time Race</span>
                        <span className = {styles.subCount}>
                            {stats.total > 0 ? `${stats.speedupFactor}x faster · Saved ${stats.timeSavedMs} ms` : "No requests yet"}
                        </span>
                    </div>

                    <div className = {styles.raceBars}>
                        <div className = {styles.raceRow}>
                            <div className = {styles.raceLabelRow}>
                                <span>With Cache</span>
                                <span className = {styles.raceMsFast}>{sim.totalLatencyMs} ms</span>
                            </div>
                            <div className = {styles.raceTrack}>
                                <div className = {styles.raceFillFast} style = {{ transform: `scaleX(${cachedBarScale})` }} />
                            </div>
                        </div>

                        <div className = {styles.raceRow}>
                            <div className = {styles.raceLabelRow}>
                                <span>Without Cache (Disk Only)</span>
                                <span className = {styles.raceMsSlow}>{stats.uncachedTotalMs} ms</span>
                            </div>
                            <div className = {styles.raceTrack}>
                                <div className = {styles.raceFillSlow} style = {{ transform: `scaleX(${uncachedBarScale})` }} />
                            </div>
                        </div>
                    </div>

                    <div className = {styles.statsRow}>
                        <div className = {styles.statCell}>
                            <span className = {styles.statLabel}>Hits</span>
                            <span className = {`${styles.statVal} ${styles.statusOk}`}>{sim.hits}</span>
                        </div>
                        <div className = {styles.statCell}>
                            <span className = {styles.statLabel}>Misses</span>
                            <span className = {`${styles.statVal} ${sim.misses > 0 ? styles.statusWarn : ""}`}>
                                {sim.misses}
                            </span>
                        </div>
                        <div className = {styles.statCell}>
                            <span className = {styles.statLabel}>Hit Rate</span>
                            <span className = {styles.statVal}>{stats.hitRatePct}%</span>
                        </div>
                        <div className = {styles.statCell}>
                            <span className = {styles.statLabel}>Avg Speed</span>
                            <span className = {styles.statVal}>
                                {stats.total > 0 ? `${stats.avgLatencyMs} ms` : "—"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
