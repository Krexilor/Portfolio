// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { useState, useEffect } from "react"

// CONSTANTS ---------------------------------------------------------------------------------------------------------------------------------------|
const HOVER_QUERY = "(any-hover: hover) and (any-pointer: fine)"

// HOOK --------------------------------------------------------------------------------------------------------------------------------------------|
export default function useHoverCapable() {
    const [canHover, setCanHover] = useState(
        () => typeof window !== "undefined" && window.matchMedia(HOVER_QUERY).matches
    )

    useEffect(() => {
        const query = window.matchMedia(HOVER_QUERY)
        const handleQueryChange = (event) => setCanHover(event.matches)

        const handlePointer = (event) => {
            if (event.pointerType === "mouse") {
                setCanHover(true)
            } else if (event.pointerType === "touch") {
                setCanHover(false)
            } else if (event.pointerType === "pen") {
                setCanHover(event.type === "pointermove" && event.buttons === 0 && query.matches)
            }
        }

        setCanHover(query.matches)
        query.addEventListener("change", handleQueryChange)
        window.addEventListener("pointermove", handlePointer, { passive: true })
        window.addEventListener("pointerdown", handlePointer, { passive: true })

        return () => {
            query.removeEventListener("change", handleQueryChange)
            window.removeEventListener("pointermove", handlePointer)
            window.removeEventListener("pointerdown", handlePointer)
        }
    }, [])

    return canHover
}
