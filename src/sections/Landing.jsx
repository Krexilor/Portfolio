// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { useRef, useEffect } from 'react'

// STYLES ------------------------------------------------------------------------------------------------------------------------------------------|
import styles from './Landing.module.css'

// COMPONENTS --------------------------------------------------------------------------------------------------------------------------------------|
import Navbar from '../components/Layout/Navbar/Navbar'

// SECTIONS ----------------------------------------------------------------------------------------------------------------------------------------|
import LabSection from './Lab/Lab.jsx'
import AboutSection from './About/About.jsx'
import ContactSection from './Contact/Contact.jsx'
import ProjectSection from './Projects/Projects.jsx'
import ExperienceSection from './Experience/Experience.jsx'

// PARTICLE BACKGROUND CONFIG ----------------------------------------------------------------------------------------------------------------------|
const PARTICLE_CONFIG = {
    particleDensity: 7000,
    maxSpeed: 0.2,
    maxSize: 2.1,
    connectionDistance: 90,
    lineOpacityMultiplier: 0.5
}

// LANDING PAGE ------------------------------------------------------------------------------------------------------------------------------------|
export default function Landing() {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        let animationFrameId
        let particles = []
        let width = 0
        let height = 0

        const resizeCanvas = () => {
            const dpr = window.devicePixelRatio || 1

            width = window.innerWidth
            height = window.innerHeight

            canvas.width = width * dpr
            canvas.height = height * dpr
            canvas.style.width = `${width}px`
            canvas.style.height = `${height}px`

            ctx.setTransform(1, 0, 0, 1, 0, 0)
            ctx.scale(dpr, dpr)

            initializeParticles()
        }

        const initializeParticles = () => {
            particles = []
            const area = width * height
            const count = Math.min(220, Math.max(60, Math.floor(area / PARTICLE_CONFIG.particleDensity)))

            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * PARTICLE_CONFIG.maxSpeed,
                    vy: (Math.random() - 0.5) * PARTICLE_CONFIG.maxSpeed,
                    radius: Math.random() * PARTICLE_CONFIG.maxSize + 0.6,
                    alpha: Math.random() * 0.4 + 0.4,
                    twinkleSpeed: 0.006 + Math.random() * 0.012,
                    twinklePhase: Math.random() * Math.PI
                })
            }
        }

        window.addEventListener('resize', resizeCanvas)
        resizeCanvas()

        const draw = () => {
            ctx.clearRect(0, 0, width, height)

            const len = particles.length

            for (let i = 0; i < len; i++) {
                const p = particles[i]

                p.x += p.vx
                p.y += p.vy

                if (p.x < -10) p.x = width + 10
                if (p.x > width + 10) p.x = -10
                if (p.y < -10) p.y = height + 10
                if (p.y > height + 10) p.y = -10

                p.twinklePhase += p.twinkleSpeed
                const currentAlpha = Math.max(0.3, p.alpha + Math.sin(p.twinklePhase) * 0.2)

                ctx.beginPath()
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha})`
                ctx.fill()

                for (let j = i + 1; j < len; j++) {
                    const p2 = particles[j]
                    const dx = p.x - p2.x
                    const dy = p.y - p2.y
                    const dist = Math.sqrt(dx * dx + dy * dy)

                    if (dist < PARTICLE_CONFIG.connectionDistance) {
                        const lineAlpha = (1 - dist / PARTICLE_CONFIG.connectionDistance) * PARTICLE_CONFIG.lineOpacityMultiplier
                        ctx.beginPath()
                        ctx.moveTo(p.x, p.y)
                        ctx.lineTo(p2.x, p2.y)
                        ctx.strokeStyle = `rgba(255, 255, 255, ${lineAlpha})`
                        ctx.lineWidth = 0.75
                        ctx.stroke()
                    }
                }
            }

            animationFrameId = requestAnimationFrame(draw)
        }

        draw()

        return () => {
            window.removeEventListener('resize', resizeCanvas)
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return (
        <div className = {styles.landingWrapper}>
            <canvas ref = {canvasRef} className = {styles.particleCanvas} />

            <Navbar />

            <div className = {styles.content}>
                <AboutSection />
                <ProjectSection />
                <ExperienceSection />
                <LabSection />
                <ContactSection />
            </div>
        </div>
    )
}
