// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { useEffect } from "react"

// HOOK --------------------------------------------------------------------------------------------------------------------------------------------|
export default function useSpotlight(ref) {
    useEffect(() => {
        const element = ref.current
        if (!element) return

        let frame = 0

        const handlePointerMove = (event) => {
            if (event.pointerType === "touch" || frame) return

            frame = requestAnimationFrame(() => {
                const box = element.getBoundingClientRect()

                element.style.setProperty("--spot-x", `${event.clientX - box.left}px`)
                element.style.setProperty("--spot-y", `${event.clientY - box.top}px`)
                element.style.setProperty("--spot-on", "1")
                frame = 0
            })
        }

        const handlePointerLeave = () => {
            cancelAnimationFrame(frame)
            frame = 0
            element.style.setProperty("--spot-on", "0")
        }

        element.addEventListener("pointermove", handlePointerMove, { passive: true })
        element.addEventListener("pointerleave", handlePointerLeave)

        return () => {
            cancelAnimationFrame(frame)
            element.removeEventListener("pointermove", handlePointerMove)
            element.removeEventListener("pointerleave", handlePointerLeave)
        }
    }, [ref])
}
