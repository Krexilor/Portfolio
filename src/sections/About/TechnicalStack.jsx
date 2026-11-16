// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { useState } from "react"
import { useReducedMotion } from "motion/react"

// COMPONENTS --------------------------------------------------------------------------------------------------------------------------------------|
import { StackGlyph, SkillSchematic } from "./StackIcon.jsx"

// UTILS -------------------------------------------------------------------------------------------------------------------------------------------|
import {
    buildStackBlueprintData,
    flattenStackEntries,
    resolveActiveSkillEntry,
    stepActiveSkillEntry
} from "../../utils/stackVisuals.js"

// STYLES ------------------------------------------------------------------------------------------------------------------------------------------|
import styles from "./About.module.css"

// INTERACTIVE TECHNICAL STACK EXPLORER ------------------------------------------------------------------------------------------------------------|
export default function TechnicalStack({
    heading = "Technical Stack",
    dynamicCategories = [],
    stackFilters = [],
    effectiveStackFilter = "all",
    onSelectFilter
}) {
    const [selectedSkillKey, setSelectedSkillKey] = useState(null)
    const shouldReduceMotion = useReducedMotion()

    const allEntries = flattenStackEntries(dynamicCategories)
    const activeEntry = resolveActiveSkillEntry(allEntries, selectedSkillKey, effectiveStackFilter)
    const blueprint = buildStackBlueprintData(dynamicCategories, effectiveStackFilter, activeEntry?.key || null)

    const activePool = effectiveStackFilter === "all"
        ? allEntries
        : allEntries.filter((entry) => entry.categoryId === effectiveStackFilter)
    const activeIndexInPool = activeEntry
        ? Math.max(0, activePool.findIndex((entry) => entry.key === activeEntry.key))
        : 0

    const activeLayerIndex = activeEntry
        ? Math.max(0, dynamicCategories.findIndex((cat) => cat.id === activeEntry.categoryId))
        : 0
    const activeLayerNodesCount = activeEntry
        ? (dynamicCategories[activeLayerIndex]?.items?.length || 1)
        : 1

    const handleSelectLayerFilter = (catId) => {
        onSelectFilter?.(catId)
        const nextEntry = resolveActiveSkillEntry(allEntries, selectedSkillKey, catId)
        if (nextEntry) setSelectedSkillKey(nextEntry.key)
    }

    const handleStep = (delta) => {
        const next = stepActiveSkillEntry(allEntries, activeEntry?.key, delta, effectiveStackFilter)
        if (next) setSelectedSkillKey(next.key)
    }

    return (
        <div className = {styles.stackBlock}>
            {/* Header & Layer Filter Bar */}
            <div className = {styles.stackHeader}>
                <div className = {styles.stackTitleGroup}>
                    <h3 className = {styles.stackSectionHeading}>{heading}</h3>
                    <span className = {styles.stackMetaLine}>
                        {blueprint.totalSkills} skills across {blueprint.layers.length} layers · Select any node
                    </span>
                </div>

                {stackFilters.length > 1 && (
                    <div className = {styles.stackFilterBar} role = "tablist" aria-label = "Filter technical stack layers">
                        {stackFilters.map((cat) => {
                            const isActive = effectiveStackFilter === cat.id
                            return (
                                <button
                                    key = {cat.id}
                                    type = "button"
                                    role = "tab"
                                    aria-selected = {isActive}
                                    className = {`${styles.stackFilterBtn} ${isActive ? styles.stackFilterBtnActive : ""}`}
                                    onClick = {() => handleSelectLayerFilter(cat.id)}
                                >
                                    <span>{cat.label}</span>
                                    <span className = {styles.stackFilterCount}>{cat.count}</span>
                                </button>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Interactive Visual Stage: Architecture Blueprint + Live Node Inspector */}
            <div className = {styles.stackWorkbench}>
                {/* Left: Interactive Layered Architecture Blueprint */}
                <div className = {styles.blueprintStage} data-testid = "stack-blueprint">
                    {blueprint.layers.map((layer, layerIdx) => {
                        const isLastLayer = layerIdx === blueprint.layers.length - 1
                        return (
                            <div
                                key = {layer.id}
                                className = {`${styles.blueprintTier} ${!layer.isHighlighted ? styles.blueprintTierDimmed : ""} ${layer.isFocusedLayer ? styles.blueprintTierFocused : ""}`}
                            >
                                {/* Vertical SVG Signal Bus Rail */}
                                <div className = {styles.tierRailCol} aria-hidden = "true">
                                    <span className = {`${styles.tierJoint} ${layer.isFocusedLayer ? styles.tierJointActive : ""}`}>
                                        {layer.layerNumber}
                                    </span>
                                    {!isLastLayer && (
                                        <span className = {`${styles.tierBusLine} ${layer.isFocusedLayer ? styles.tierBusLineActive : ""}`} />
                                    )}
                                </div>

                                {/* Layer Content: Category Label + Interactive Tech Nodes */}
                                <div className = {styles.tierContent}>
                                    <div className = {styles.tierHead}>
                                        <button
                                            type = "button"
                                            className = {styles.tierLabelBtn}
                                            onClick = {() => handleSelectLayerFilter(effectiveStackFilter === layer.id ? "all" : layer.id)}
                                            aria-label = {`Focus ${layer.title} layer`}
                                        >
                                            {layer.title}
                                        </button>
                                        <span className = {styles.tierCount}>{layer.nodes.length}</span>
                                    </div>

                                    <div className = {styles.tierNodeGrid}>
                                        {layer.nodes.map((node) => (
                                            <button
                                                key = {node.key}
                                                type = "button"
                                                aria-pressed = {node.isSelected}
                                                className = {`${styles.nodeTile} ${node.isSelected ? styles.nodeTileActive : ""}`}
                                                onClick = {() => setSelectedSkillKey(node.key)}
                                            >
                                                <span className = {styles.nodeGlyphWrap}>
                                                    <StackGlyph iconKey = {node.iconKey} fallbackKey = {node.fallbackIconKey} />
                                                </span>
                                                <span className = {styles.nodeTileText}>
                                                    <span className = {styles.nodeTileName}>{node.name}</span>
                                                    {node.role && <span className = {styles.nodeTileRole}>{node.role}</span>}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Right: Live Schematic & Focused Skill Inspector */}
                {activeEntry && (
                    <aside className = {styles.stackInspector} aria-live = "polite" data-testid = "stack-inspector">
                        <div className = {styles.inspectorHead}>
                            <span className = {styles.inspectorKicker}>
                                {activeEntry.categoryTitle}
                                {activeEntry.item.role ? ` · ${activeEntry.item.role}` : ""}
                            </span>
                            <span className = {styles.inspectorCounter}>
                                {activeIndexInPool + 1} / {activePool.length}
                            </span>
                        </div>

                        <div className = {styles.schematicFrame}>
                            <SkillSchematic
                                activeEntry = {activeEntry}
                                layerIndex = {activeLayerIndex}
                                layerNodesCount = {activeLayerNodesCount}
                                reducedMotion = {Boolean(shouldReduceMotion)}
                                className = {styles.schematicSvg}
                                flowClassName = {styles.schematicPulse}
                            />
                        </div>

                        <div className = {styles.inspectorBody}>
                            <div className = {styles.inspectorTitleRow}>
                                <span className = {styles.inspectorIcon}>
                                    <StackGlyph
                                        iconKey = {activeEntry.iconKey}
                                        fallbackKey = {activeEntry.fallbackIconKey}
                                    />
                                </span>
                                <h4 className = {styles.inspectorTitle}>{activeEntry.item.name}</h4>
                            </div>
                            {activeEntry.item.detail && (
                                <p className = {styles.inspectorDetail}>{activeEntry.item.detail}</p>
                            )}
                        </div>

                        <div className = {styles.inspectorFooter}>
                            <button
                                type = "button"
                                className = {styles.inspectorNavBtn}
                                onClick = {() => handleStep(-1)}
                            >
                                ← Previous
                            </button>
                            <button
                                type = "button"
                                className = {styles.inspectorNavBtn}
                                onClick = {() => handleStep(1)}
                            >
                                Next →
                            </button>
                        </div>
                    </aside>
                )}
            </div>
        </div>
    )
}
