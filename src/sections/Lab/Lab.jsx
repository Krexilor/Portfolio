// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { Terminal } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { motion, MotionConfig } from 'motion/react'

// STYLES ------------------------------------------------------------------------------------------------------------------------------------------|
import styles from './Lab.module.css'

// DATA --------------------------------------------------------------------------------------------------------------------------------------------|
import { terminalConfig, commands, unknownResponses } from '../../data/lab.data.js'

// CONSTANTS ---------------------------------------------------------------------------------------------------------------------------------------|
const visibleCommands = commands.filter((command) => !command.hidden)
const visibleNames = visibleCommands.map((command) => command.name)
const commandMap = Object.fromEntries(commands.map((command) => [command.name, command]))
const helpLines = [{ type: 'rows', rows: visibleCommands.map((command) => [command.name, command.description]) }]

const SHORTCUTS = [
    { keys: ['Enter'], label: 'run' },
    { keys: ['↑', '↓'], label: 'history' },
    { keys: ['Tab'], label: 'complete' }
]

// AUTOCOMPLETE HELPER -----------------------------------------------------------------------------------------------------------------------------|
function getCommonPrefix(words) {
    return words.reduce((prefix, word) => {
        let index = 0

        while (index < prefix.length && prefix[index] === word[index]) index++

        return prefix.slice(0, index)
    })
}

// UPTIME COUNTER ----------------------------------------------------------------------------------------------------------------------------------|
function Uptime() {
    const [seconds, setSeconds] = useState(0)

    useEffect(() => {
        const id = setInterval(() => setSeconds((prev) => prev + 1), 1000)
        return () => clearInterval(id)
    }, [])

    const minutes = String(Math.floor(seconds / 60)).padStart(2, '0')
    const remainder = String(seconds % 60).padStart(2, '0')

    return <>{minutes}:{remainder}</>
}

// OUTPUT LINE RENDER HELPER -----------------------------------------------------------------------------------------------------------------------|
function OutputLine({ line }) {
    if (typeof line === 'string') {
        return <p className = {`${styles.line} ${styles.output}`}>{line || '\u00A0'}</p>
    }

    if (line.type === 'rows') {
        return (
            <div className = {styles.table}>
                {line.rows.map(([name, description]) => (
                    <div key = {name} className = {styles.tableRow}>
                        <span className = {styles.tableName}>{name}</span>
                        <span className = {styles.tableDescription}>{description}</span>
                    </div>
                ))}
            </div>
        )
    }

    if (line.type === 'link') {
        const isExternal = line.href.startsWith('http')

        return (
            <div className = {styles.tableRow}>
                <span className = {styles.tableName}>{line.label}</span>
                <a
                    href = {line.href}
                    className = {styles.link}
                    {...(isExternal ? { target: '_blank', rel: 'noreferrer' } : {})}
                >
                    {line.text || line.href}
                </a>
            </div>
        )
    }

    return null
}

// MOTION VARIANTS ---------------------------------------------------------------------------------------------------------------------------------|
const ease = [0.22, 1, 0.36, 1]
const hoverSpring = { type: 'spring', stiffness: 400, damping: 18 }

const viewport = { once: true, amount: 0.15, margin: '0px 0px -10% 0px' }
const reveal = { initial: 'hidden', whileInView: 'visible', viewport }

const cardVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: (order = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.65, ease, delay: order * 0.1 }
    })
}

const listVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } }
}

const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } }
}

const chipVariants = {
    hidden: { opacity: 0, scale: 0.92, y: 6 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            opacity: { duration: 0.3, ease },
            default: { type: 'spring', stiffness: 320, damping: 26 }
        }
    },
    hover: { y: -2, transition: hoverSpring }
}

// LAB SECTION -------------------------------------------------------------------------------------------------------------------------------------|
export default function LabSection() {
    const [entries, setEntries] = useState([{ id: 0, command: null, lines: terminalConfig.welcome }])
    const [input, setInput] = useState('')
    const [ranCount, setRanCount] = useState(0)

    const terminalRef = useRef(null)
    const bodyRef = useRef(null)
    const inputRef = useRef(null)
    const nextId = useRef(1)
    const pastCommands = useRef([])
    const historyCursor = useRef(null)
    const draft = useRef('')
    const lastPicks = useRef({})

    useEffect(() => {
        const body = bodyRef.current

        if (body) body.scrollTop = body.scrollHeight
    }, [entries])

    const pickIndex = (key, length) => {
        if (length < 2) return 0

        let index = Math.floor(Math.random() * length)

        if (index === lastPicks.current[key]) index = (index + 1) % length

        lastPicks.current[key] = index

        return index
    }

    const addEntry = (command, lines) => {
        const id = nextId.current++

        setEntries((prev) => [...prev, { id, command, lines }])
    }

    const getOutput = (name, raw) => {
        if (name === 'help') return helpLines

        const command = commandMap[name]

        if (command?.random) return command.random[pickIndex(name, command.random.length)]
        if (command) return command.output

        const message = unknownResponses[pickIndex('unknown', unknownResponses.length)]

        return [message.replace('{command}', raw)]
    }

    const runCommand = (raw) => {
        const trimmed = raw.trim()

        historyCursor.current = null
        draft.current = ''
        setInput('')

        if (!trimmed) {
            addEntry('', [])
            return
        }

        const name = trimmed.toLowerCase().split(/\s+/)[0]

        if (pastCommands.current.at(-1) !== trimmed) pastCommands.current.push(trimmed)

        setRanCount((count) => count + 1)

        if (name === 'clear') {
            setEntries([])
            return
        }

        addEntry(trimmed, getOutput(name, trimmed))
    }

    const handleAutocomplete = () => {
        const value = input.trimStart().toLowerCase()

        if (!value || value.includes(' ')) return

        const matches = visibleNames.filter((name) => name.startsWith(value))

        if (!matches.length) return

        if (matches.length === 1) {
            setInput(matches[0])
            return
        }

        const prefix = getCommonPrefix(matches)

        if (prefix.length > value.length) {
            setInput(prefix)
            return
        }

        addEntry(input, [matches.join('  ')])
    }

    const handleKeyDown = (event) => {
        const past = pastCommands.current

        if (event.key === 'ArrowUp') {
            event.preventDefault()

            if (!past.length) return

            if (historyCursor.current === null) {
                draft.current = input
                historyCursor.current = past.length - 1
            } else {
                historyCursor.current = Math.max(0, historyCursor.current - 1)
            }

            setInput(past[historyCursor.current])
        } else if (event.key === 'ArrowDown') {
            event.preventDefault()

            if (historyCursor.current === null) return

            if (historyCursor.current < past.length - 1) {
                historyCursor.current += 1
                setInput(past[historyCursor.current])
            } else {
                historyCursor.current = null
                setInput(draft.current)
            }
        } else if (event.key === 'Tab') {
            event.preventDefault()
            handleAutocomplete()
        }
    }

    const handleChange = (event) => {
        historyCursor.current = null
        setInput(event.target.value)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        runCommand(input)
    }

    const handleChip = (name) => {
        runCommand(name)
        terminalRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }

    const focusInput = () => {
        if (window.getSelection()?.toString()) return

        inputRef.current?.focus({ preventScroll: true })
    }

    return (
        <MotionConfig reducedMotion = "user">
            <section id = "lab" className = {styles.section}>
                <div className = {styles.grid}>

                    {/* Info Card */}
                    <motion.div
                        className = {`${styles.card} ${styles.infoCard}`}
                        variants = {cardVariants}
                        custom = {0}
                        {...reveal}
                    >

                        <div className = {styles.infoHeader}>
                            <div className = {styles.titleRow}>
                                <span className = {styles.titleIcon}><Terminal size = {18} /></span>
                                <h2 className = {styles.title}>Lab</h2>
                            </div>

                            <p className = {styles.subtitle}>A playground for experiments and ideas that don't fit anywhere else.</p>
                        </div>

                        <div className = {styles.divider} />

                        {/* Session stats */}
                        <motion.div
                            className = {styles.stats}
                            variants = {listVariants}
                            {...reveal}
                        >
                            <motion.div className = {styles.stat} variants = {itemVariants}>
                                <span className = {styles.statNumber}>{visibleCommands.length}</span>
                                <span className = {styles.statCaption}>Commands</span>
                            </motion.div>

                            <motion.div className = {styles.stat} variants = {itemVariants}>
                                <span className = {styles.statNumber}>{String(ranCount).padStart(2, '0')}</span>
                                <span className = {styles.statCaption}>Ran</span>
                            </motion.div>

                            <motion.div className = {styles.stat} variants = {itemVariants}>
                                <span className = {styles.statNumber}><Uptime /></span>
                                <span className = {styles.statCaption}>
                                    <span className = {styles.pulseDot} />
                                    Uptime
                                </span>
                            </motion.div>
                        </motion.div>

                        {/* Quick commands */}
                        <div className = {styles.group}>
                            <span className = {styles.groupLabel}>Try a command</span>

                            <motion.div
                                className = {styles.chipGrid}
                                variants = {listVariants}
                                {...reveal}
                            >
                                {visibleCommands.map((command) => (
                                    <motion.button
                                        key = {command.name}
                                        type = "button"
                                        className = {styles.chip}
                                        onClick = {() => handleChip(command.name)}
                                        variants = {chipVariants}
                                        whileHover = "hover"
                                        whileTap = {{ scale: 0.97 }}
                                    >
                                        {command.name}
                                    </motion.button>
                                ))}
                            </motion.div>
                        </div>

                        {/* Keyboard shortcuts */}
                        <motion.div
                            className = {styles.shortcuts}
                            variants = {listVariants}
                            {...reveal}
                        >
                            {SHORTCUTS.map((shortcut) => (
                                <motion.span
                                    key = {shortcut.label}
                                    className = {styles.shortcut}
                                    variants = {itemVariants}
                                >
                                    <span className = {styles.keys}>
                                        {shortcut.keys.map((key) => (
                                            <kbd key = {key} className = {styles.key}>{key}</kbd>
                                        ))}
                                    </span>
                                    <span className = {styles.shortcutLabel}>{shortcut.label}</span>
                                </motion.span>
                            ))}
                        </motion.div>

                    </motion.div>

                    {/* Terminal Card */}
                    <motion.div
                        ref = {terminalRef}
                        className = {styles.terminalCard}
                        variants = {cardVariants}
                        custom = {1}
                        {...reveal}
                    >
                        <div className = {styles.terminal}>

                            <div className = {styles.titleBar}>
                                <div className = {styles.dots} aria-hidden = "true">
                                    <span className = {styles.dot} />
                                    <span className = {styles.dot} />
                                    <span className = {styles.dot} />
                                </div>

                                <span className = {styles.titleText}>{terminalConfig.title}</span>
                                <span className = {styles.shell}>{terminalConfig.shell}</span>
                            </div>

                            <div ref = {bodyRef} className = {styles.body} onClick = {focusInput} role = "log">
                                {entries.map((entry) => (
                                    <motion.div
                                        key = {entry.id}
                                        className = {styles.entry}
                                        initial = {entry.id === 0 ? false : { opacity: 0, y: 4 }}
                                        animate = {{ opacity: 1, y: 0 }}
                                        transition = {{ duration: 0.2, ease }}
                                    >
                                        {entry.command !== null && (
                                            <p className = {styles.line}>
                                                <span className = {styles.prompt}>{terminalConfig.prompt}</span>
                                                <span className = {styles.command}>{entry.command}</span>
                                            </p>
                                        )}

                                        {entry.lines.map((line, index) => (
                                            <OutputLine key = {index} line = {line} />
                                        ))}
                                    </motion.div>
                                ))}

                                <form className = {styles.inputLine} onSubmit = {handleSubmit}>
                                    <span className = {styles.prompt}>{terminalConfig.prompt}</span>
                                    <input
                                        ref = {inputRef}
                                        type = "text"
                                        className = {styles.input}
                                        value = {input}
                                        onChange = {handleChange}
                                        onKeyDown = {handleKeyDown}
                                        placeholder = {ranCount === 0 ? terminalConfig.placeholder : ''}
                                        aria-label = "Terminal input"
                                        enterKeyHint = "send"
                                        spellCheck = {false}
                                        autoComplete = "off"
                                        autoCorrect = "off"
                                        autoCapitalize = "off"
                                    />
                                </form>
                            </div>

                        </div>
                    </motion.div>

                </div>
            </section>
        </MotionConfig>
    )
}
