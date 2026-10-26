// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { useInView } from "motion/react"
import { useState, useEffect, useRef } from "react"

// HOOK --------------------------------------------------------------------------------------------------------------------------------------------|
export default function useReveal(options = {}) {
    const ref = useRef(null)
    const isInView = useInView(ref, { amount: 0.15, ...options })
    const [hasRevealed, setHasRevealed] = useState(false)

    useEffect(() => {
        if (isInView) setHasRevealed(true)
    }, [isInView])

    return { ref, isInView, hasRevealed }
}
