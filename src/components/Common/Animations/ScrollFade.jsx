// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'motion/react'

// SCROLL-DRIVEN REVEAL WRAPPER --------------------------------------------------------------------------------------------------------------------|
export default function ScrollFade({ children, className, distance = 60 }) {
    const ref = useRef(null)
    const [isNavScrolling, setIsNavScrolling] = useState(false)
    const [isSmallScreen, setIsSmallScreen] = useState(false)

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start']
    })

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 120,
        damping: 24,
        mass: 0.5
    })

    const opacity = useTransform(smoothProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0])
    const y = useTransform(smoothProgress, [0, 0.25, 0.75, 1], [distance, 0, 0, -distance])
    const scale = useTransform(smoothProgress, [0, 0.25, 0.75, 1], [0.96, 1, 1, 0.96])

    useEffect(() => {
        const handleNavScroll = (event) => setIsNavScrolling(event.detail)
        window.addEventListener('nav-scroll', handleNavScroll)
        return () => window.removeEventListener('nav-scroll', handleNavScroll)
    }, [])

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 1023px)')

        const updateScreenSize = () => setIsSmallScreen(mediaQuery.matches)
        updateScreenSize()

        mediaQuery.addEventListener('change', updateScreenSize)
        return () => mediaQuery.removeEventListener('change', updateScreenSize)
    }, [])

    const shouldFreeze = isNavScrolling || isSmallScreen

    return (
        <motion.div
            ref = {ref}
            className = {className}
            style = {shouldFreeze ? { opacity: 1, y: 0, scale: 1 } : { opacity, y, scale }}
        >
            {children}
        </motion.div>
    )
}
