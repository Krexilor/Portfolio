// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

// SCROLL-DRIVEN REVEAL WRAPPER --------------------------------------------------------------------------------------------------------------------|
export default function ScrollFade({ children, className, distance = 60 }) {
    const ref = useRef(null)

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start']
    })

    const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0])
    const y = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [distance, 0, 0, -distance])

    return (
        <motion.div ref = {ref} className = {className} style = {{ opacity, y }}>
            {children}
        </motion.div>
    )
}
