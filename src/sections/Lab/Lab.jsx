// STYLES ------------------------------------------------------------------------------------------------------------------------------------------|
import styles from './Lab.module.css'

// PLACEHOLDER CONTENT (REPLACED WHEN THE REAL TERMINAL IS BUILT) ----------------------------------------------------------------------------------|
const PROMPT = 'krexilor@lab:~$'

const LINES = [
    { type: 'command', text: './lab --init' },
    { type: 'output', text: 'Booting experimental sandbox...' },
    { type: 'output', text: 'Terminal coming soon.' }
]

// LAB SECTION -------------------------------------------------------------------------------------------------------------------------------------|
export default function LabSection() {
    return (
        <section id = "lab" className = {styles.section}>
            <div className = {styles.container}>

                <div className = {styles.card}>

                    {/* Header */}
                    <div className = {styles.header}>
                        <h2 className = {styles.title}>Lab</h2>
                        <p className = {styles.subtitle}>A playground for experiments and ideas that don't fit anywhere else.</p>
                    </div>

                    {/* Terminal */}
                    <div className = {styles.terminal}>

                        <div className = {styles.titleBar}>
                            <div className = {styles.dots} aria-hidden = "true">
                                <span className = {styles.dot} />
                                <span className = {styles.dot} />
                                <span className = {styles.dot} />
                            </div>
                            <span className = {styles.titleText}>{PROMPT} lab</span>
                        </div>

                        <div className = {styles.body}>
                            {LINES.map((line, index) => (
                                line.type === 'command' ? (
                                    <p key = {index} className = {styles.line}>
                                        <span className = {styles.prompt}>{PROMPT}</span>
                                        <span className = {styles.command}>{line.text}</span>
                                    </p>
                                ) : (
                                    <p key = {index} className = {`${styles.line} ${styles.output}`}>{line.text}</p>
                                )
                            ))}

                            <p className = {styles.line}>
                                <span className = {styles.prompt}>{PROMPT}</span>
                                <span className = {styles.cursor} aria-hidden = "true" />
                            </p>
                        </div>

                    </div>

                </div>

            </div>
        </section>
    )
}
