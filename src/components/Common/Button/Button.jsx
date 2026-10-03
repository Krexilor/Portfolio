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

// SOCIAL BUTTONS ----------------------------------------------------------------------------------------------------------------------------------|
function SocialBtn({ href, icon, children, className = '' }) {
    return (
        <motion.a
            href = {href}
            target = "_blank"
            rel = "noreferrer"
            className = {`${styles.socialBtn} ${className}`}
            whileHover = {{ y: -2 }}
            whileTap = {{ y: 0, scale: 0.96 }}
            transition = {{ type: 'spring', stiffness: 400, damping: 20 }}
        >
            <motion.span className = {styles.socialIcon} whileHover = {{ scale: 1.15 }}>
                {icon}
            </motion.span>
            {children}
        </motion.a>
    )
}

export function GithubBtn({ href, className = '' }) {
    return (
        <SocialBtn
            href = "https://github.com/Krexilor"
            className = {className}
            icon = {
                <svg viewBox = "0 0 24 24" fill = "currentColor" xmlns = "http://www.w3.org/2000/svg">
                    <path d = "M12 0C5.373 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.744.083-.729.083-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.303-5.467-1.334-5.467-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.625-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
            }
        >
            GitHub
        </SocialBtn>
    )
}

export function LinkedinBtn({ href, className = '' }) {
    return (
        <SocialBtn
            href = "https://www.linkedin.com/in/aaravmalik-pro"
            className = {className}
            icon = {
                <svg viewBox = "0 0 24 24" fill = "currentColor" xmlns = "http://www.w3.org/2000/svg">
                    <path d = "M4.98 3.5C4.98 4.881 3.87 6 2.5 6S0 4.881 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8.98h4.56V24H.22V8.98zM8.98 8.98h4.37v2.05h.06c.61-1.16 2.1-2.38 4.32-2.38 4.62 0 5.47 3.04 5.47 6.99V24h-4.56v-6.98c0-1.67-.03-3.81-2.32-3.81-2.33 0-2.69 1.82-2.69 3.7V24H8.98V8.98z" />
                </svg>
            }
        >
            LinkedIn
        </SocialBtn>
    )
}

export function XBtn({ href, className = '' }) {
    return (
        <SocialBtn
            href = "https://x.com/krexilor"
            className = {className}
            icon = {
                <svg viewBox = "0 0 24 24" fill = "currentColor" xmlns = "http://www.w3.org/2000/svg">
                    <path d = "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            }
        >
            Twitter
        </SocialBtn>
    )
}
