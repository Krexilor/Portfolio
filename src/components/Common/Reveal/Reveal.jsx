// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { motion, useReducedMotion } from "motion/react"

// SCROLL REVEAL WRAPPER ----------------------------------------------------------------------------------------------------------------------------|
export default function Reveal({
    children,
    className = "",
    delay = 0,
    y = 20,
    as = "div"
}) {
    const shouldReduceMotion = useReducedMotion()
    const Component = motion[as] || motion.div

    if (shouldReduceMotion) {
        const StaticTag = as
        return <StaticTag className = {className}>{children}</StaticTag>
    }

    return (
        <Component
            className = {className}
            initial = {{ opacity: 0, y }}
            whileInView = {{ opacity: 1, y: 0 }}
            viewport = {{ once: true, amount: 0.15 }}
            transition = {{
                duration: 0.55,
                delay,
                ease: [0.16, 1, 0.3, 1]
            }}
        >
            {children}
        </Component>
    )
}
