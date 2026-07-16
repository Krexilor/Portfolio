// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'motion/react'

// SCROLL-DRIVEN REVEAL WRAPPER --------------------------------------------------------------------------------------------------------------------|
export default function ScrollFade({ children, className, distance = 60 }) {
    const ref = useRef(null)

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

    return (
        <motion.div ref = {ref} className = {className} style = {{ opacity, y, scale }}>
            {children}
        </motion.div>
    )
}
