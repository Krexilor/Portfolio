// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'

// STYLES ------------------------------------------------------------------------------------------------------------------------------------------|
import styles from './Navbar.module.css'

// COMPONENTS --------------------------------------------------------------------------------------------------------------------------------------|
import { ResumeBtn } from '../../Common/Button/Button.jsx'

// NAVBAR COMPONENT --------------------------------------------------------------------------------------------------------------------------------|
const navItems = ['About', 'Projects', 'Experience', 'Lab', 'Contact']

export default function Navbar() {
    const [activeTab, setActiveTab] = useState('Home')
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const isClickScrolling = useRef(false)
    const navigate = useNavigate()

    useEffect(() => {
        const sections = navItems.map((item) => document.getElementById(item.toLowerCase())).filter(Boolean)

        const observer = new IntersectionObserver(
            (entries) => {
                if (isClickScrolling.current) return

                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const matched = navItems.find(
                            (item) => item.toLowerCase() === entry.target.id
                        )
                        if (matched) setActiveTab(matched)
                    }
                })
            },
            { rootMargin: '-50% 0px -50% 0px', threshold: 0 }
        )

        sections.forEach((section) => observer.observe(section))
        return () => observer.disconnect()
    }, [])

    const handleClick = (item) => {
        isClickScrolling.current = true
        setActiveTab(item)
        setIsMenuOpen(false)
        document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })

        clearTimeout(handleClick.timeoutId)
        handleClick.timeoutId = setTimeout(() => {
            isClickScrolling.current = false
        }, 700)
    }

    return (
        <>
            <nav className = {styles.navbar}>
                <span className = {styles.logo}>Aarav Malik</span>

                <span className = {styles.divider} />

                <ul className = {styles.navList} role = "list">
                    {navItems.map((item) => {
                        const isActive = activeTab === item

                        return (
                            <li key = {item} className = {styles.navItemWrapper}>
                                {isActive && (
                                    <motion.div
                                        layoutId = "activeTrack"
                                        className = {styles.ghost}
                                        transition = {{ type: 'spring', stiffness: 300, damping: 30, mass: 0.8 }}
                                    />
                                )}

                                <button
                                    className = {`${styles.navItem} ${isActive ? styles.active : ''}`}
                                    onClick = {() => handleClick(item)}
                                >
                                    {item}
                                </button>
                            </li>
                        )
                    })}
                </ul>

                <button
                    className = {styles.hamburger}
                    onClick = {() => setIsMenuOpen((prev) => !prev)}
                    aria-label = "Toggle menu"
                >
                    <motion.span
                        className = {styles.hamburgerLine}
                        animate = {{ rotate: isMenuOpen ? 45 : 0, y: isMenuOpen ? 7 : 0 }}
                        transition = {{ duration: 0.25, ease: 'easeInOut' }}
                    />
                    <motion.span
                        className = {styles.hamburgerLine}
                        animate = {{ opacity: isMenuOpen ? 0 : 1 }}
                        transition = {{ duration: 0.2 }}
                    />
                    <motion.span
                        className = {styles.hamburgerLine}
                        animate = {{ rotate: isMenuOpen ? -45 : 0, y: isMenuOpen ? -7 : 0 }}
                        transition = {{ duration: 0.25, ease: 'easeInOut' }}
                    />
                </button>

                <span className={`${styles.divider} ${styles.pushRight}`} />

                <ResumeBtn onClick = {() => navigate('/resume')} />
            </nav>

            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        className = {styles.mobileMenu}
                        initial = {{ opacity: 0, y: -12, scale: 0.98 }}
                        animate = {{ opacity: 1, y: 0, scale: 1 }}
                        exit = {{ opacity: 0, y: -12, scale: 0.98 }}
                        transition = {{ duration: 0.25, ease: 'easeOut' }}
                    >
                        <ul className = {styles.mobileNavList} role = "list">
                            {navItems.map((item) => {
                                const isActive = activeTab === item

                                return (
                                    <li key = {item}>
                                        <button
                                            className = {`${styles.mobileNavItem} ${isActive ? styles.mobileActive : ''}`}
                                            onClick = {() => handleClick(item)}
                                        >
                                            {item}
                                        </button>
                                    </li>
                                )
                            })}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
