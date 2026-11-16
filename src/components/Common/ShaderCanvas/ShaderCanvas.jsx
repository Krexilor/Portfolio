// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { useEffect, useRef } from "react"
import { useReducedMotion } from "motion/react"

// SHADERS ------------------------------------------------------------------------------------------------------------------------------------------|
import vertexSource from "../../../shaders/field.vert.glsl?raw"
import fragmentSource from "../../../shaders/field.frag.glsl?raw"

// STYLES ------------------------------------------------------------------------------------------------------------------------------------------|
import styles from "./ShaderCanvas.module.css"

// SHADER COMPILER HELPERS --------------------------------------------------------------------------------------------------------------------------|
function compileShader(gl, type, source) {
    const shader = gl.createShader(type)
    if (!shader) return null

    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader)
        return null
    }

    return shader
}

function createProgram(gl, vertSrc, fragSrc) {
    const vert = compileShader(gl, gl.VERTEX_SHADER, vertSrc)
    const frag = compileShader(gl, gl.FRAGMENT_SHADER, fragSrc)
    if (!vert || !frag) return null

    const program = gl.createProgram()
    if (!program) return null

    gl.attachShader(program, vert)
    gl.attachShader(program, frag)
    gl.linkProgram(program)

    gl.deleteShader(vert)
    gl.deleteShader(frag)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        gl.deleteProgram(program)
        return null
    }

    return program
}

// INTERACTIVE GLSL SHADER CANVAS -------------------------------------------------------------------------------------------------------------------|
export default function ShaderCanvas({ className = "" }) {
    const canvasRef = useRef(null)
    const shouldReduceMotion = useReducedMotion()

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const gl = canvas.getContext("webgl", {
            alpha: false,
            antialias: false,
            powerPreference: "low-power"
        })

        if (!gl) return

        const program = createProgram(gl, vertexSource, fragmentSource)
        if (!program) return

        canvas.setAttribute("data-shader-ready", "true")

        const positionLoc = gl.getAttribLocation(program, "a_position")
        const buffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
            gl.STATIC_DRAW
        )

        const uniforms = {
            resolution: gl.getUniformLocation(program, "u_resolution"),
            mouse: gl.getUniformLocation(program, "u_mouse"),
            click: gl.getUniformLocation(program, "u_click"),
            time: gl.getUniformLocation(program, "u_time"),
            clickTime: gl.getUniformLocation(program, "u_clickTime"),
            hover: gl.getUniformLocation(program, "u_hover"),
            scroll: gl.getUniformLocation(program, "u_scroll")
        }

        const state = {
            targetMouseX: 0.5,
            targetMouseY: 0.45,
            mouseX: 0.5,
            mouseY: 0.45,
            targetHover: 0.35,
            hover: 0.35,
            clickX: 0.5,
            clickY: 0.5,
            clickStart: -10,
            scrollNorm: 0,
            isVisible: true
        }

        let rafId = 0
        const startTime = performance.now()
        let cachedRect = { left: 0, top: 0, width: 1, height: 1 }

        const syncBounds = () => {
            const rect = canvas.getBoundingClientRect()
            cachedRect = {
                left: rect.left,
                top: rect.top,
                width: Math.max(1, rect.width),
                height: Math.max(1, rect.height)
            }
        }

        const resize = () => {
            syncBounds()
            const dpr = Math.min(window.devicePixelRatio || 1, 1.25)
            const width = Math.max(1, Math.floor(cachedRect.width * dpr))
            const height = Math.max(1, Math.floor(cachedRect.height * dpr))

            if (canvas.width !== width || canvas.height !== height) {
                canvas.width = width
                canvas.height = height
                gl.viewport(0, 0, width, height)
            }
        }

        const drawFrame = (now) => {
            const elapsedSec = (now - startTime) * 0.001

            // Smooth pointer inertia
            state.mouseX += (state.targetMouseX - state.mouseX) * 0.08
            state.mouseY += (state.targetMouseY - state.mouseY) * 0.08
            state.hover += (state.targetHover - state.hover) * 0.06

            const clickAge = state.clickStart > 0 ? Math.max(0, elapsedSec - state.clickStart) : 0

            gl.useProgram(program)
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
            gl.enableVertexAttribArray(positionLoc)
            gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0)

            gl.uniform2f(uniforms.resolution, canvas.width, canvas.height)
            gl.uniform2f(uniforms.mouse, state.mouseX, state.mouseY)
            gl.uniform2f(uniforms.click, state.clickX, state.clickY)
            gl.uniform1f(uniforms.time, shouldReduceMotion ? 1.2 : elapsedSec)
            gl.uniform1f(uniforms.clickTime, shouldReduceMotion ? 0 : clickAge)
            gl.uniform1f(uniforms.hover, state.hover)
            gl.uniform1f(uniforms.scroll, state.scrollNorm)

            gl.drawArrays(gl.TRIANGLES, 0, 6)
        }

        const tick = (now) => {
            if (!state.isVisible || shouldReduceMotion || document.hidden) {
                rafId = 0
                return
            }

            drawFrame(now)
            rafId = window.requestAnimationFrame(tick)
        }

        const startLoop = () => {
            if (shouldReduceMotion) {
                drawFrame(performance.now())
                return
            }
            if (!rafId && state.isVisible && !document.hidden) {
                rafId = window.requestAnimationFrame(tick)
            }
        }

        const handlePointerMove = (event) => {
            const nx = (event.clientX - cachedRect.left) / cachedRect.width
            const ny = (event.clientY - cachedRect.top) / cachedRect.height

            if (nx >= 0 && nx <= 1 && ny >= 0 && ny <= 1) {
                state.targetMouseX = nx
                state.targetMouseY = ny
                state.targetHover = 1.0
            } else if (event.pointerType === "mouse") {
                state.targetHover = 0.28
            }
        }

        const handlePointerDown = (event) => {
            syncBounds()
            const nx = (event.clientX - cachedRect.left) / cachedRect.width
            const ny = (event.clientY - cachedRect.top) / cachedRect.height

            if (nx >= 0 && nx <= 1 && ny >= 0 && ny <= 1) {
                state.targetMouseX = nx
                state.targetMouseY = ny
                state.targetHover = 1.0
                state.clickX = nx
                state.clickY = ny
                state.clickStart = (performance.now() - startTime) * 0.001
                if (shouldReduceMotion) {
                    drawFrame(performance.now())
                }
            }
        }

        const handlePointerEnd = (event) => {
            if (event.pointerType === "touch" || event.pointerType === "pen") {
                state.targetHover = 0.35
            }
        }

        const handleDocumentLeave = (event) => {
            if (!event.relatedTarget) {
                state.targetHover = 0.28
            }
        }

        const handleScroll = () => {
            syncBounds()
            const maxScroll = Math.max(window.innerHeight, 1)
            state.scrollNorm = Math.min(1.5, window.scrollY / maxScroll)
            if (shouldReduceMotion) {
                drawFrame(performance.now())
            }
        }

        const handleVisibilityChange = () => {
            if (document.hidden && rafId) {
                window.cancelAnimationFrame(rafId)
                rafId = 0
            } else if (!document.hidden && state.isVisible) {
                startLoop()
            }
        }

        const handleEasterWave = () => {
            state.clickX = 0.88
            state.clickY = 0.48
            state.clickStart = (performance.now() - startTime) * 0.001
            state.targetHover = 1.0
            if (shouldReduceMotion) {
                drawFrame(performance.now())
            }
        }

        const resizeObserver = new ResizeObserver(() => {
            resize()
            if (shouldReduceMotion) {
                drawFrame(performance.now())
            }
        })

        const intersectionObserver = new IntersectionObserver(
            (entries) => {
                const entry = entries[0]
                state.isVisible = Boolean(entry?.isIntersecting)
                if (state.isVisible) {
                    startLoop()
                } else if (rafId) {
                    window.cancelAnimationFrame(rafId)
                    rafId = 0
                }
            },
            { threshold: 0.01 }
        )

        resize()
        resizeObserver.observe(canvas)
        intersectionObserver.observe(canvas)
        window.addEventListener("pointermove", handlePointerMove, { passive: true })
        window.addEventListener("pointerdown", handlePointerDown, { passive: true })
        window.addEventListener("pointerup", handlePointerEnd, { passive: true })
        window.addEventListener("pointercancel", handlePointerEnd, { passive: true })
        document.addEventListener("mouseout", handleDocumentLeave)
        document.addEventListener("visibilitychange", handleVisibilityChange)
        window.addEventListener("scroll", handleScroll, { passive: true })
        window.addEventListener("krexilor:easter-wave", handleEasterWave)

        startLoop()

        return () => {
            if (rafId) window.cancelAnimationFrame(rafId)
            resizeObserver.disconnect()
            intersectionObserver.disconnect()
            window.removeEventListener("pointermove", handlePointerMove)
            window.removeEventListener("pointerdown", handlePointerDown)
            window.removeEventListener("pointerup", handlePointerEnd)
            window.removeEventListener("pointercancel", handlePointerEnd)
            document.removeEventListener("mouseout", handleDocumentLeave)
            document.removeEventListener("visibilitychange", handleVisibilityChange)
            window.removeEventListener("scroll", handleScroll)
            window.removeEventListener("krexilor:easter-wave", handleEasterWave)
            gl.deleteBuffer(buffer)
            gl.deleteProgram(program)
        }
    }, [shouldReduceMotion])

    return (
        <div className = {`${styles.wrapper} ${className}`} aria-hidden = "true">
            <canvas
                ref = {canvasRef}
                className = {styles.canvas}
                data-testid = "hero-shader"
            />
            <div className = {styles.scrim} />
        </div>
    )
}
