// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { useState, useEffect } from "react"

// CONSTANTS ---------------------------------------------------------------------------------------------------------------------------------------|
const HOVER_QUERY = "(hover: hover) and (pointer: fine)"

// HOOK --------------------------------------------------------------------------------------------------------------------------------------------|
export default function useHoverCapable() {
    const [canHover, setCanHover] = useState(
        () => typeof window !== "undefined" && window.matchMedia(HOVER_QUERY).matches
    )

    useEffect(() => {
        const query = window.matchMedia(HOVER_QUERY)
        const handleChange = (event) => setCanHover(event.matches)

        setCanHover(query.matches)
        query.addEventListener("change", handleChange)

        return () => query.removeEventListener("change", handleChange)
    }, [])

    return canHover
}
