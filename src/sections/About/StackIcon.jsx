// DATA-DRIVEN LUCIDE SKILL GLYPHS & LIVE ARCHITECTURE SCHEMATIC -----------------------------------------------------------------------------------|
import {
    Activity,
    Binary,
    Box,
    Braces,
    Code2,
    Container,
    Cpu,
    Database,
    FileCode2,
    Flame,
    GitBranch,
    Globe,
    Hammer,
    HardDrive,
    Layers,
    Network,
    Server,
    Shield,
    SquareTerminal,
    Table2,
    Terminal,
    Waypoints,
    Workflow,
    Wrench
} from "lucide-react"
import { DynamicIcon, iconNames } from "lucide-react/dynamic"
import { normalizeLucideIconName } from "../../utils/stackVisuals.js"

// Zero-flash synchronous registry for default stack & fallback icons; any other Lucide icon name resolves dynamically via lucide-react/dynamic.
const SYNC_LUCIDE_ICONS = {
    activity: Activity,
    binary: Binary,
    box: Box,
    braces: Braces,
    "code-2": Code2,
    code2: Code2,
    container: Container,
    cpu: Cpu,
    database: Database,
    "file-code-2": FileCode2,
    filecode2: FileCode2,
    flame: Flame,
    "git-branch": GitBranch,
    globe: Globe,
    hammer: Hammer,
    "hard-drive": HardDrive,
    layers: Layers,
    network: Network,
    server: Server,
    shield: Shield,
    "square-terminal": SquareTerminal,
    "table-2": Table2,
    terminal: Terminal,
    waypoints: Waypoints,
    workflow: Workflow,
    wrench: Wrench
}

const VALID_LUCIDE_NAMES = new Set(iconNames)

function truncateLabel(value, maxLen = 18) {
    const str = String(value || "").trim()
    if (str.length <= maxLen) return str
    return `${str.slice(0, Math.max(1, maxLen - 1))}…`
}

export function StackGlyph({ iconKey, fallbackKey = "box", size = 18, className = "" }) {
    const normalized = normalizeLucideIconName(iconKey)
    const fallbackNormalized = normalizeLucideIconName(fallbackKey)
    const FallbackIcon = SYNC_LUCIDE_ICONS[fallbackNormalized] || Box

    const SyncIcon = SYNC_LUCIDE_ICONS[normalized]
    if (SyncIcon) {
        return <SyncIcon size = {size} strokeWidth = {1.75} className = {className} aria-hidden = "true" />
    }

    if (normalized && VALID_LUCIDE_NAMES.has(normalized)) {
        return (
            <DynamicIcon
                name = {normalized}
                size = {size}
                strokeWidth = {1.75}
                className = {className}
                aria-hidden = "true"
                fallback = {() => <FallbackIcon size = {size} strokeWidth = {1.75} className = {className} aria-hidden = "true" />}
            />
        )
    }

    return <FallbackIcon size = {size} strokeWidth = {1.75} className = {className} aria-hidden = "true" />
}

export function SkillSchematic({
    activeEntry,
    layerIndex = 0,
    layerNodesCount = 1,
    reducedMotion = false,
    className = "",
    flowClassName = ""
}) {
    if (!activeEntry) return null

    const flowClass = reducedMotion ? "" : flowClassName
    const layerTag = String(layerIndex + 1).padStart(2, "0")
    const layerLabel = truncateLabel(activeEntry.categoryLabel || activeEntry.categoryTitle, 14)
    const skillName = truncateLabel(activeEntry.item?.name, 20)
    const skillRole = truncateLabel(activeEntry.item?.role || activeEntry.categoryTitle, 24)
    const pipCount = Math.max(1, Math.min(8, layerNodesCount))
    const activeIdx = Math.min(pipCount - 1, activeEntry.indexInCategory || 0)

    const rightBoxX = 154
    const rightBoxWidth = 154
    const sidePadding = 12
    const pipGap = 4
    const innerWidth = rightBoxWidth - sidePadding * 2
    const pipWidth = (innerWidth - (pipCount - 1) * pipGap) / pipCount
    const totalRowWidth = pipCount * pipWidth + (pipCount - 1) * pipGap
    const rowStartX = rightBoxX + (rightBoxWidth - totalRowWidth) / 2

    return (
        <svg viewBox = "0 0 320 112" className = {className} aria-hidden = "true">
            {/* Left Layer Block (100% populated from stack.data.js category) */}
            <rect x = "12" y = "20" width = "92" height = "72" rx = "8" fill = "#1B241C" stroke = "#30372F" />
            <text x = "58" y = "42" textAnchor = "middle" fill = "#929D8D" fontSize = "9.5" fontFamily = "IBM Plex Mono">
                LAYER {layerTag}
            </text>
            <text x = "58" y = "60" textAnchor = "middle" fill = "#F0F1E9" fontSize = "10.5" fontWeight = "600" fontFamily = "Manrope">
                {layerLabel}
            </text>
            <text x = "58" y = "77" textAnchor = "middle" fill = "#B8E986" fontSize = "8.5" fontFamily = "IBM Plex Mono">
                {layerNodesCount} {layerNodesCount === 1 ? "node" : "nodes"}
            </text>

            {/* Animated Signal Bus */}
            <path d = "M106 56 H144" stroke = "#B8E986" strokeWidth = "2" strokeDasharray = "5 5" className = {flowClass} />
            <polygon points = "143,51 151,56 143,61" fill = "#B8E986" />

            {/* Right Active Node Schematic (100% populated from stack.data.js item) */}
            <rect x = {rightBoxX} y = "14" width = {rightBoxWidth} height = "84" rx = "8" fill = "#1B241C" stroke = "#B8E986" strokeOpacity = "0.8" />
            <text x = {rightBoxX + sidePadding} y = "36" fill = "#F0F1E9" fontSize = "11.5" fontWeight = "700" fontFamily = "Manrope">
                {skillName}
            </text>
            <text x = {rightBoxX + sidePadding} y = "54" fill = "#B8E986" fontSize = "9" fontFamily = "IBM Plex Mono">
                {skillRole}
            </text>

            {/* Layer Slot Pips (centered symmetrically inside right box) */}
            {Array.from({ length: pipCount }).map((_, idx) => {
                const x = Number((rowStartX + idx * (pipWidth + pipGap)).toFixed(2))
                const width = Number(pipWidth.toFixed(2))
                const isCurrent = idx === activeIdx
                return (
                    <rect
                        key = {idx}
                        x = {x}
                        y = "70"
                        width = {width}
                        height = "14"
                        rx = "3"
                        fill = {isCurrent ? "#B8E986" : "#101310"}
                        fillOpacity = {isCurrent ? 0.3 : 1}
                        stroke = {isCurrent ? "#B8E986" : "#485444"}
                    />
                )
            })}
        </svg>
    )
}
