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
        const pointerQuery = window.matchMedia(
            "(any-pointer: fine) and (any-hover: hover)"
        )

        const timeouts = new Set();
        let activeMouse = false;

        const hideCursor = () => {
            setIsVisible(false)
            setIsPressed(false)
            pressedButtons.current.clear()
        }

        const handlePointerMove = (e) => {
            if (e.pointerType !== "mouse" || !pointerQuery.matches) {
                if (e.pointerType !== "mouse") hideCursor()
                return
            }

            activeMouse = true
            mousePos.current = { x: e.clientX, y: e.clientY }

            if (cursorRef.current) {
                cursorRef.current.style.transform =
                    `translate3d(${e.clientX}px, ${e.clientY}px, 0) scale(${
                        pressedButtons.current.size > 0 ? 0.75 : 1
                    })`
            }

            setIsVisible(true)
        }

        const handleMouseDown = (e) => {
            if (e.button !== 0 && e.button !== 2) return
            if (!pointerQuery.matches || !activeMouse) return

            pressedButtons.current.add(e.button)
            setIsPressed(true);

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
                setRipples((prev) =>
                    prev.filter((ripple) => ripple.id !== id)
                )
                timeouts.delete(timeout)
            }, 700)

            timeouts.add(timeout)
        }

        const handleMouseUp = (e) => {
            pressedButtons.current.delete(e.button)
            setIsPressed(pressedButtons.current.size > 0)
        }

        const handleMouseLeave = () => {
            activeMouse = false
            hideCursor()
        }

        const handleBlur = () => {
            pressedButtons.current.clear();
            setIsPressed(false)
        }

        const handlePointerCapabilityChange = () => {
            if (!pointerQuery.matches) {
                activeMouse = false
                hideCursor()
            }
        }

        const handleContextMenu = (e) => {
            if (activeMouse && pointerQuery.matches) {
                e.preventDefault()
            }
        }

        window.addEventListener("pointermove", handlePointerMove)
        window.addEventListener("mousedown", handleMouseDown)
        window.addEventListener("mouseup", handleMouseUp)
        window.addEventListener("blur", handleBlur)
        window.addEventListener("contextmenu", handleContextMenu)
        document.addEventListener("mouseleave", handleMouseLeave)
        pointerQuery.addEventListener("change", handlePointerCapabilityChange)

        return () => {
            window.removeEventListener("pointermove", handlePointerMove)
            window.removeEventListener("mousedown", handleMouseDown)
            window.removeEventListener("mouseup", handleMouseUp)
            window.removeEventListener("blur", handleBlur)
            window.removeEventListener("contextmenu", handleContextMenu)
            document.removeEventListener("mouseleave", handleMouseLeave)
            pointerQuery.removeEventListener(
                "change",
                handlePointerCapabilityChange
            )

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
                className = {`${styles.cursor} ${
                    isVisible ? styles.visible : ""
                } ${isPressed ? styles.pressed : ""}`}
            >
                <svg
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
    );
}
