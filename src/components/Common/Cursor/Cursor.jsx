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

        const hideCursor = () => {
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

            if (e.pointerType !== "mouse" || !pointerQuery.matches) {
                if (e.pointerType !== "mouse") hideCursor()
                return
            }

            activeMouse = true
            mousePos.current = { x: e.clientX, y: e.clientY }

            updatePosition()
            setIsVisible(true)
        }

        const handleMouseDown = (e) => {
            if (!isMounted) return
            if (e.button !== 0 && e.button !== 2) return
            if (!pointerQuery.matches || !activeMouse) return

            pressedButtons.current.add(e.button)
            setIsPressed(true)

            const id = `${Date.now()}-${Math.random()}`

            setRipples((prev) => [
                ...prev,
                {
                    id,
                    x: mousePos.current.x,
                    y: mousePos.current.y
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

        const handleMouseUp = (e) => {
            if (!isMounted) return

            pressedButtons.current.delete(e.button)
            setIsPressed(pressedButtons.current.size > 0)
        }

        const handleMouseLeave = () => {
            if (!isMounted) return

            activeMouse = false
            hideCursor()
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
            if (!isMounted || event.relatedTarget) return

            activeMouse = false
            hideCursor()
        }

        window.addEventListener("contextmenu", handleContextMenu)
        window.addEventListener("pointermove", handlePointerMove)
        window.addEventListener("mousedown", handleMouseDown)
        window.addEventListener("mouseup", handleMouseUp)
        window.addEventListener("blur", handleBlur)
        document.addEventListener("mouseout", handleMouseOut)
        pointerQuery.addEventListener("change", handlePointerCapabilityChange)
        
        return () => {
            isMounted = false
            window.removeEventListener("contextmenu", handleContextMenu)
            window.removeEventListener("pointermove", handlePointerMove)
            window.removeEventListener("mousedown", handleMouseDown)
            window.removeEventListener("mouseup", handleMouseUp)
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
                    width = "25"
                    height = "25"
                    viewBox = "0 0 25 25"
                    fill = "none"
                    xmlns = "http://www.w3.org/2000/svg"
                >
                    <path
                        d = "M 3.5 3.5 Q 3.0 3.0 3.2 4.0 L 8.6 20.8 Q 8.9 21.6 9.6 20.9 L 12.3 15.2 Q 12.6 14.6 13.2 14.3 L 18.9 11.6 Q 19.6 10.9 18.8 10.6 L 4.0 3.2 Q 3.0 3.0 3.5 3.5 Z"
                        fill = "currentColor"
                        stroke = "currentColor"
                        strokeWidth = "1.5"
                        strokeLinejoin = "round"
                        strokeLinecap = "round"
                    />
                </svg>
            </div>
        </div>
    )
}
