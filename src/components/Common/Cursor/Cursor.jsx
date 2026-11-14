// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { useEffect, useRef, useState } from "react"

// STYLES ------------------------------------------------------------------------------------------------------------------------------------------|
import styles from "./Cursor.module.css"

// CUSTOM CURSOR -----------------------------------------------------------------------------------------------------------------------------------|
export default function Cursor() {
    const cursorRef = useRef(null)
    const mousePos = useRef({ x: -100, y: -100 })
    const pressedButtons = useRef(new Set())

    const [isVisible, setIsVisible] = useState(false)
    const [isPressed, setIsPressed] = useState(false)
    const [ripples, setRipples] = useState([])

    useEffect(() => {
        let isMounted = true

        const pointerQuery = window.matchMedia(
            "(any-pointer: fine) and (any-hover: hover)"
        )
        const timeouts = new Set()
        let activeMouse = false

        const setCursorAttribute = (enabled) => {
            if (enabled) {
                document.documentElement.setAttribute("data-custom-cursor", "on")
            } else {
                document.documentElement.removeAttribute("data-custom-cursor")
            }
        }

        const hideCursor = () => {
            setCursorAttribute(false)
            if (!isMounted) return

            setIsVisible(false)
            setIsPressed(false)
            pressedButtons.current.clear()
        }

        const updatePosition = () => {
            if (!cursorRef.current || !isMounted) return

            const { x, y } = mousePos.current

            cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
        }

        const handlePointerMove = (e) => {
            if (!isMounted) return

            if (e.pointerType !== "mouse") {
                activeMouse = false
                hideCursor()
                return
            }

            if (!pointerQuery.matches) {
                activeMouse = false
                hideCursor()
                return
            }

            activeMouse = true
            setCursorAttribute(true)
            mousePos.current = { x: e.clientX, y: e.clientY }

            updatePosition()
            setIsVisible(true)
        }

        const handlePointerDown = (e) => {
            if (!isMounted) return

            if (e.pointerType !== "mouse") {
                activeMouse = false
                hideCursor()
                return
            }

            if (e.button !== 0 && e.button !== 2) return
            if (!pointerQuery.matches) return

            activeMouse = true
            setCursorAttribute(true)
            mousePos.current = { x: e.clientX, y: e.clientY }
            updatePosition()
            setIsVisible(true)

            pressedButtons.current.add(e.button)
            setIsPressed(true)

            const id = `${Date.now()}-${Math.random()}`

            setRipples((prev) => [
                ...prev,
                {
                    id,
                    x: e.clientX,
                    y: e.clientY
                }
            ])

            const timeout = window.setTimeout(() => {
                if (!isMounted) return

                setRipples((prev) => prev.filter((ripple) => ripple.id !== id))
                timeouts.delete(timeout)
            }, 700)

            timeouts.add(timeout)
        }

        const handleContextMenu = () => {
            if (!isMounted) return

            pressedButtons.current.clear()
            setIsPressed(false)
        }

        const handlePointerUp = (e) => {
            if (!isMounted || e.pointerType !== "mouse") return

            pressedButtons.current.delete(e.button)
            setIsPressed(pressedButtons.current.size > 0)
        }

        const handlePointerCancel = () => {
            if (!isMounted) return

            pressedButtons.current.clear()
            setIsPressed(false)
        }

        const handleBlur = () => {
            if (!isMounted) return

            pressedButtons.current.clear()
            setIsPressed(false)
        }

        const handlePointerCapabilityChange = () => {
            if (!isMounted) return

            if (!pointerQuery.matches) {
                activeMouse = false
                hideCursor()
            }
        }

        const handleMouseOut = (event) => {
            if (!isMounted || event.relatedTarget || !activeMouse) return

            activeMouse = false
            hideCursor()
        }

        window.addEventListener("contextmenu", handleContextMenu)
        window.addEventListener("pointermove", handlePointerMove, { passive: true })
        window.addEventListener("pointerdown", handlePointerDown, { passive: true })
        window.addEventListener("pointerup", handlePointerUp, { passive: true })
        window.addEventListener("pointercancel", handlePointerCancel, { passive: true })
        window.addEventListener("blur", handleBlur)
        document.addEventListener("mouseout", handleMouseOut)
        pointerQuery.addEventListener("change", handlePointerCapabilityChange)

        return () => {
            isMounted = false
            setCursorAttribute(false)
            window.removeEventListener("contextmenu", handleContextMenu)
            window.removeEventListener("pointermove", handlePointerMove)
            window.removeEventListener("pointerdown", handlePointerDown)
            window.removeEventListener("pointerup", handlePointerUp)
            window.removeEventListener("pointercancel", handlePointerCancel)
            window.removeEventListener("blur", handleBlur)
            document.removeEventListener("mouseout", handleMouseOut)
            pointerQuery.removeEventListener("change", handlePointerCapabilityChange)
            timeouts.forEach(clearTimeout)
        }
    }, [])

    return (
        <div className = {styles.cursorLayer}>
            {ripples.map((ripple) => (
                <div
                    key = {ripple.id}
                    className = {styles.ripple}
                    style = {{
                        left: `${ripple.x + 3.5}px`,
                        top: `${ripple.y + 3.5}px`
                    }}
                />
            ))}

            <div
                ref = {cursorRef}
                className = {`${styles.cursor} ${isVisible ? styles.visible : ""}`}
            >
                <svg
                    className = {`${styles.cursorShape} ${isPressed ? styles.cursorShapePressed : ""}`}
                    width = "26"
                    height = "26"
                    viewBox = "0 0 26 26"
                    fill = "none"
                    xmlns = "http://www.w3.org/2000/svg"
                >
                    <path
                        d = "M 4 3.5 L 9.5 21.2 L 12.6 15.1 L 19.2 12 L 4 3.5 Z"
                        fill = "#E4FABF"
                        stroke = "#090D09"
                        strokeWidth = "2.6"
                        strokeLinejoin = "round"
                        strokeLinecap = "round"
                        style = {{ paintOrder: "stroke" }}
                    />
                    <path
                        d = "M 5.4 5.2 L 9.8 18.8 L 12.1 14.2 L 16.9 11.9 L 5.4 5.2 Z"
                        fill = "#FFFFFF"
                        fillOpacity = "0.5"
                    />
                </svg>
            </div>
        </div>
    )
}
