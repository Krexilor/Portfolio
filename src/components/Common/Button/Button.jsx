// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { motion } from 'motion/react'

// STYLES ------------------------------------------------------------------------------------------------------------------------------------------|
import styles from './Button.module.css'

// BUTTONS -----------------------------------------------------------------------------------------------------------------------------------------|
export function PrimaryBtn({ children, onClick, type = 'button', disabled = false, className = '' }) {
    return (
        <motion.button
            type = {type}
            onClick = {onClick}
            disabled = {disabled}
            className = {`${styles.primaryBtn} ${className}`}
            whileHover = {{ scale: 1.03 }}
            whileTap = {{ scale: 0.97 }}
            transition = {{ duration: 0.2, ease: 'easeOut' }}
        >
            {children}
        </motion.button>
    )
}

export function ResumeBtn({ onClick, className = '' }) {
    return (
        <motion.button
            type = "button"
            onClick = {onClick}
            className = {`${styles.resumeBtn} ${className}`}
            whileHover = {{ scale: 1.03 }}
            whileTap = {{ scale: 0.97 }}
            transition = {{ duration: 0.2, ease: 'easeOut' }}
        >
            Resume
        </motion.button>
    )
}
