// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'

// STYLES ------------------------------------------------------------------------------------------------------------------------------------------|
import styles from './Navbar.module.css'

// NAVBAR ------------------------------------------------------------------------------------------------------------------------------------------|
const tabs = ['Home', 'About', 'Skills', 'Projects', 'Achievements', 'Contact']

const springTransition = { type: 'spring', stiffness: 380, damping: 30 }
const hoverSpringTransition = { type: 'spring', stiffness: 400, damping: 25 }

export default function Navbar() {
    const [activeTab, setActiveTab] = useState('Home')
    const [hoveredTab, setHoveredTab] = useState(null)
    const isScrolling = useRef(false)
    const scrollTimeout = useRef(null)

    const handleTabClick = (tab) => {
        isScrolling.current = true
        setActiveTab(tab)
        const el = document.getElementById(tab.toLowerCase())
        if (el) el.scrollIntoView({ behavior: 'smooth' })
        if (scrollTimeout.current) clearTimeout(scrollTimeout.current)
        scrollTimeout.current = setTimeout(() => { isScrolling.current = false }, 850)
    }

    useEffect(() => {
        const handleScroll = () => {
            if (isScrolling.current) return
            const scrollPos = window.scrollY + 200
            for (const tab of tabs) {
                const el = document.getElementById(tab.toLowerCase())
                if (el) {
                    const { offsetTop, offsetHeight } = el
                    if (scrollPos >= offsetTop && scrollPos < offsetTop + offsetHeight) {
                        setActiveTab(tab)
                        break
                    }
                }
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header className = {styles.header}>
            <LayoutGroup id = "navbar-group">
                <nav className = {styles.nav}>
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab
                        const isHovered = hoveredTab === tab
                        return (
                            <button
                                key = {tab}
                                onClick = {() => handleTabClick(tab)}
                                onMouseEnter = {() => setHoveredTab(tab)}
                                onMouseLeave = {() => setHoveredTab(null)}
                                className = {styles.tabBtn}
                            >
                                <motion.span
                                    animate = {{
                                        color: isActive ? '#58DFFF' : isHovered ? '#F0FBFF' : '#6F8BFF',
                                        textShadow: isActive ? '0 0 8px rgba(88, 223, 255, 0.4)' : 'none',
                                        y: isActive ? -0.5 : 0
                                    }}
                                    transition = {{ duration: 0.2 }}
                                    className = {styles.tabText}
                                >
                                    {tab}
                                </motion.span>

                                {isActive && (
                                    <motion.div
                                        layoutId = "activeUnderline"
                                        className = {styles.activeUnderline}
                                        transition = {springTransition}
                                    />
                                )}

                                <AnimatePresence>
                                    {isHovered && !isActive && (
                                        <motion.div
                                            initial = {{ scaleX: 0, opacity: 0 }}
                                            animate = {{ scaleX: 1, opacity: 1 }}
                                            exit = {{ scaleX: 0, opacity: 0 }}
                                            transition = {hoverSpringTransition}
                                            style = {{ originX: 0.5 }}
                                            className = {styles.hoverUnderline}
                                        />
                                    )}
                                </AnimatePresence>
                            </button>
                        )
                    })}
                </nav>
            </LayoutGroup>
        </header>
    )
}
