// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { ShaderMaterial } from 'three'
import { motion } from 'framer-motion'
import { useGLTF } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useMemo, useState, useEffect } from 'react'
import { EffectComposer, Bloom } from '@react-three/postprocessing'

// STYLES ------------------------------------------------------------------------------------------------------------------------------------------|
import '../../styles/components/common/PreLoader.css'

// SHADERS -----------------------------------------------------------------------------------------------------------------------------------------|
import vertexShader from '../../shaders/PreLoader/vertex.glsl'
import fragmentShader from '../../shaders/PreLoader/fragment.glsl'

// UTILS -------------------------------------------------------------------------------------------------------------------------------------------|
import { ASSET_MANIFEST, LOADER_CONFIG, animateProgress, preloadAssets } from '../../utils/preLoaderUtils'

// MODEL CONTROLS ----------------------------------------------------------------------------------------------------------------------------------|
const ModelControls = {
    position: { x: 0, y: 0.5, z: 0 },
    scale: 0.8,
}

// PARTICLE CONTROLS -------------------------------------------------------------------------------------------------------------------------------|
const ParticleControls = {
    count: 1000,
    size: 0.03,
    color: "#88ccff",
    baseOpacity: 0.2,
    twinkleSpeed: 0.8,
    speed: { x: 0.02, y: 0.05 },
    spread: { x: 15, y: 15, z: 10 },
    explodeSpeed: 8,
}

// MODEL -------------------------------------------------------------------------------------------------------------------------------------------|
function Model() {
    const { scene } = useGLTF('/src/assets/models/Loader.glb')

    scene.traverse((child) => {
        if (child.isMesh) {
            if (child.name === "Core") {
                child.material = new ShaderMaterial({
                    vertexShader,
                    fragmentShader,
                    uniforms: {
                        uTime: { value: 0 },
                        uType: { value: 0 },
                    }
                })
            }
            if (child.name === "Shell") {
                child.material = new ShaderMaterial({
                    vertexShader,
                    fragmentShader,
                    uniforms: {
                        uTime: { value: 0 },
                        uType: { value: 1 },
                    },
                    transparent: true,
                    toneMapped: false,
                })
            }
        }
    })

    scene.position.set(ModelControls.position.x, ModelControls.position.y, ModelControls.position.z)
    scene.scale.setScalar(ModelControls.scale)

    useFrame(({ clock }) => {
        scene.traverse((child) => {
            if (child.isMesh && child.material.uniforms?.uTime) {
                child.material.uniforms.uTime.value = clock.elapsedTime
            }
        })
    })

    return <primitive object = {scene} />
}

// DUST PARTICLES ----------------------------------------------------------------------------------------------------------------------------------|
function DustParticles({ explodingRef }) {
    const pointsRef = useRef()
    const materialRef = useRef()

    const { positions, velocities } = useMemo(() => {
        const count = ParticleControls.count
        const pos = new Float32Array(count * 3)
        const vel = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * ParticleControls.spread.x
            pos[i * 3 + 1] = (Math.random() - 0.5) * ParticleControls.spread.y
            pos[i * 3 + 2] = (Math.random() - 0.5) * ParticleControls.spread.z
            vel[i * 3] = (Math.random() - 0.5) * 2
            vel[i * 3 + 1] = (Math.random() - 0.5) * 2
            vel[i * 3 + 2] = (Math.random() - 0.5) * 2
        }
        return { positions: pos, velocities: vel }
    }, [])

    useFrame((state, delta) => {
        const t = state.clock.getElapsedTime()

        if (explodingRef?.current) {
            if (pointsRef.current) {
                const pos = pointsRef.current.geometry.attributes.position.array
                for (let i = 0; i < ParticleControls.count; i++) {
                    pos[i * 3] += velocities[i * 3] * delta * ParticleControls.explodeSpeed
                    pos[i * 3 + 1] += velocities[i * 3 + 1] * delta * ParticleControls.explodeSpeed
                    pos[i * 3 + 2] += velocities[i * 3 + 2] * delta * ParticleControls.explodeSpeed
                }
                pointsRef.current.geometry.attributes.position.needsUpdate = true
            }
            if (materialRef.current) {
                materialRef.current.opacity = Math.max(0, materialRef.current.opacity - delta * 2.5)
            }
        } else {
            if (pointsRef.current) {
                pointsRef.current.rotation.y += delta * ParticleControls.speed.y
                pointsRef.current.rotation.x += delta * ParticleControls.speed.x
            }
            if (materialRef.current) {
                materialRef.current.opacity = ParticleControls.baseOpacity + Math.abs(Math.sin(t * ParticleControls.twinkleSpeed)) * 0.2
            }
        }
    })

    return (
        <points ref = {pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach = "attributes-position"
                    count = {positions.length / 3}
                    array = {positions}
                    itemSize = {3}
                />
            </bufferGeometry>
            <pointsMaterial
                ref = {materialRef}
                size = {ParticleControls.size}
                color = {ParticleControls.color}
                transparent = {true}
                opacity = {ParticleControls.baseOpacity}
                depthWrite = {false}
                sizeAttenuation = {true}
                blending = {2}
            />
        </points>
    )
}

// HUD OVERLAY -------------------------------------------------------------------------------------------------------------------------------------|
function HudOverlay({ progress, isExiting }) {
    const microStars = useMemo(() => [...Array(50)].map((_, i) => ({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 1.5,
    })), [])

    return (
        <motion.div
            className = "hud-overlay"
            animate = {{ opacity: isExiting ? 0 : 1 }}
            transition = {{ duration: 0.3 }}
        >
            {microStars.map(star => (
                <motion.div
                    key = {star.id}
                    className = "micro-star"
                    initial = {{ opacity: 0 }}
                    animate = {{ opacity: [0.1, 0.6, 0.1] }}
                    transition = {{ duration: star.duration, repeat: Infinity, delay: star.delay }}
                    style = {{ top: star.top, left: star.left }}
                />
            ))}

            <motion.div
                className = "corner-brackets"
                initial = {{ opacity: 0, scale: 1.06 }}
                animate = {{ opacity: 0.5, scale: 1 }}
                transition = {{ duration: 0.9, ease: 'easeOut' }}
            >
                <div className = "bracket top-left" />
                <div className = "bracket top-right" />
                <div className = "bracket bottom-left" />
                <div className = "bracket bottom-right" />
            </motion.div>

            <div className = "scanline-container left">
                <motion.div
                    animate = {{ top: ['0%', '100%'], opacity: [0, 1, 0] }}
                    transition = {{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    className = "scanline"
                />
            </div>

            <div className = "scanline-container right">
                <motion.div
                    animate = {{ bottom: ['0%', '100%'], opacity: [0, 1, 0] }}
                    transition = {{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    className = "scanline reverse"
                />
            </div>

            <div className = "center-loader-container">
                <motion.div
                    className = "loader-line-glow"
                    animate = {{
                        width: ["0px", "180px", "140px", "200px", "0px"],
                        opacity: [0, 1, 0.8, 1, 0]
                    }}
                    transition = {{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className = "loader-line-base" />
                <motion.div
                    className = "loader-subtext"
                    animate = {{ opacity: [0.3, 1, 0.3] }}
                    transition = {{ duration: 2, repeat: Infinity }}
                >
                    {progress >= 100 ? '◈ ALL SYSTEMS NOMINAL ◈' : '◈ CALIBRATING SYSTEMS ◈'}
                </motion.div>
                {progress >= 100 && (
                    <motion.div
                        className = "click-anywhere-text"
                        initial = {{ opacity: 0 }}
                        animate = {{ opacity: 1 }}
                        transition = {{ duration: 0.6, ease: 'easeOut' }}
                    >
                        CLICK ANYWHERE
                    </motion.div>
                )}
            </div>

            <motion.div
                className = "telemetry top-left"
                initial = {{ opacity: 0, x: -12 }}
                animate = {{ opacity: 1, x: 0 }}
                transition = {{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            >
                <span className = "status-label">SYSTEM STATUS: NOMINAL</span>
                <div className = "data-row">
                    <span className = "data-text">LAT: 40.7128° N</span>
                </div>
            </motion.div>

            <motion.div
                className = "telemetry bottom-right"
                initial = {{ opacity: 0, x: 12 }}
                animate = {{ opacity: 1, x: 0 }}
                transition = {{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            >
                <div className = "percentage-container">
                    <span className = "percentage-label">PROCESSING</span>
                    <span className = "percentage-value">{progress.toString().padStart(2, '0')}%</span>
                </div>
            </motion.div>
        </motion.div>
    )
}

// PRELOADER --------------------------------------------------------------------------------------------------------------------------------------|
function PreLoader({ onComplete }) {
    const [phase, setPhase] = useState('entering')
    const [progress, setProgress] = useState(0)
    const explodingRef = useRef(false)

    useEffect(() => {
        const timer = setTimeout(() => setPhase('loading'), LOADER_CONFIG.entry.duration)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        if (phase !== 'loading') return

        let cancelled = false
        let simulatedDone = false
        let realDone = false

        preloadAssets((val) => {
            if (cancelled) return
            if (simulatedDone) {
                setProgress(val)
                if (val >= 100) setPhase('ready')
            } else {
                if (val >= 100) realDone = true
            }
        })

        const cancelSim = animateProgress(0, LOADER_CONFIG.simulated.target, LOADER_CONFIG.simulated.duration, (val) => {
            if (!cancelled) setProgress(val)
        })

        const handoff = setTimeout(() => {
            if (cancelled) return
            cancelSim()
            simulatedDone = true

            if (realDone) {
                animateProgress(LOADER_CONFIG.simulated.target, 100, 500, (val) => {
                    if (!cancelled) setProgress(val)
                    if (val >= 100) setPhase('ready')
                })
            }
        }, LOADER_CONFIG.simulated.duration)

        return () => {
            cancelled = true
            cancelSim()
            clearTimeout(handoff)
        }
    }, [phase])

    function handleEnter() {
        explodingRef.current = true
        setPhase('exiting')
    }

    function handleAnimationComplete() {
        if (phase === 'exiting') onComplete?.()
    }

    return (
        <motion.div
            className = "preloader-container"
            initial = {{ opacity: 0, scale: 0.97 }}
            animate = {
                phase === 'exiting'
                    ? { opacity: 0, scale: 1.07 }
                    : { opacity: 1, scale: 1 }
            }
            transition = {
                phase === 'exiting'
                    ? { duration: LOADER_CONFIG.exit.duration / 1000, ease: 'easeIn' }
                    : { duration: 0.8, ease: 'easeOut' }
            }
            onAnimationComplete = {handleAnimationComplete}
            onClick = {phase === 'ready' ? handleEnter : undefined}
            style = {{ cursor: phase === 'ready' ? 'pointer' : 'default' }}
        >
            <Canvas camera = {{ position: [0, 0, 5], fov: 50 }}>
                <ambientLight intensity = {0.2} />
                <DustParticles explodingRef = {explodingRef} />
                <Model />
                <EffectComposer>
                    <Bloom
                        intensity = {1.0}
                        luminanceThreshold = {0.1}
                        luminanceSmoothing = {0.9}
                        mipmapBlur
                    />
                </EffectComposer>
            </Canvas>

            <HudOverlay progress = {progress} isExiting = {phase === 'exiting'} />
        </motion.div>
    )
}

// EXPORTS -----------------------------------------------------------------------------------------------------------------------------------------|
export default PreLoader

// MODEL PRELOAD -----------------------------------------------------------------------------------------------------------------------------------|
ASSET_MANIFEST.models.forEach(path => useGLTF.preload(path))
