// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { useEffect } from "react"
import { useLocation } from "react-router"

// SCROLL TO HASH ----------------------------------------------------------------------------------------------------------------------------------|
export default function ScrollToHash() {
    const { pathname, hash, key } = useLocation()

    useEffect(() => {
        const target = hash ? document.getElementById(hash.slice(1)) : null

        if (target) {
            target.scrollIntoView()
        } else {
            window.scrollTo(0, 0)
        }
    }, [pathname, hash, key])

    return null
}
