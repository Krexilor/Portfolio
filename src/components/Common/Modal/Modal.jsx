// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { useEffect } from "react"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"

// STYLES ------------------------------------------------------------------------------------------------------------------------------------------|
import styles from "./Modal.module.css"

// ACCESSIBLE MODAL ---------------------------------------------------------------------------------------------------------------------------------|
export default function Modal({ isOpen, onClose, title, eyebrow, children }) {
    const shouldReduceMotion = useReducedMotion()

    useEffect(() => {
        if (!isOpen) return

        const handleKeyDown = (event) => {
            if (event.key === "Escape") onClose()
        }

        const prevOverflow = document.body.style.overflow
        document.body.style.overflow = "hidden"
        window.addEventListener("keydown", handleKeyDown)

        return () => {
            document.body.style.overflow = prevOverflow
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [isOpen, onClose])

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className = {styles.backdrop}
                    initial = {shouldReduceMotion ? false : { opacity: 0 }}
                    animate = {{ opacity: 1 }}
                    exit = {shouldReduceMotion ? undefined : { opacity: 0 }}
                    transition = {{ duration: 0.2 }}
                    onClick = {onClose}
                    role = "presentation"
                >
                    <motion.div
                        className = {styles.dialog}
                        role = "dialog"
                        aria-modal = "true"
                        aria-label = {title}
                        initial = {shouldReduceMotion ? false : { opacity: 0, y: 18, scale: 0.98 }}
                        animate = {{ opacity: 1, y: 0, scale: 1 }}
                        exit = {shouldReduceMotion ? undefined : { opacity: 0, y: 12, scale: 0.98 }}
                        transition = {{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        onClick = {(event) => event.stopPropagation()}
                    >
                        <div className = {styles.header}>
                            <div className = {styles.headerText}>
                                {eyebrow && <span className = "eyebrow">{eyebrow}</span>}
                                <h3 className = {styles.title}>{title}</h3>
                            </div>

                            <button
                                type = "button"
                                className = {styles.closeBtn}
                                onClick = {onClose}
                                aria-label = "Close dialog"
                            >
                                ✕
                            </button>
                        </div>

                        <div className = {styles.body}>
                            {children}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
