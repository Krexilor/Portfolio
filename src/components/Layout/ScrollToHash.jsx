// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { useEffect } from "react"
import { useLocation } from "react-router"

// SCROLL TO HASH ----------------------------------------------------------------------------------------------------------------------------------|
export default function ScrollToHash() {
    const { pathname, hash, key } = useLocation()

    useEffect(() => {
        if (!hash) {
            window.scrollTo({ top: 0, left: 0, behavior: "auto" })
            return
        }

        const id = hash.slice(1)
        const rafId = window.requestAnimationFrame(() => {
            const target = document.getElementById(id)
            if (target) {
                target.scrollIntoView({ behavior: "smooth", block: "start" })
            }
        })

        return () => window.cancelAnimationFrame(rafId)
    }, [pathname, hash, key])

    return null
}
