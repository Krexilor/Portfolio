// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { ShaderMaterial } from 'three'
import { motion } from 'framer-motion'
import { useGLTF } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useMemo, useState, useEffect } from 'react'
import { EffectComposer, Bloom } from '@react-three/postprocessing'

// STYLES ------------------------------------------------------------------------------------------------------------------------------------------|
import styles from './PreLoader.module.css'

// SHADERS -----------------------------------------------------------------------------------------------------------------------------------------|
const vertexShader = `
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec3 vLocalPosition;

    void main() {
        vNormal = normalize(normalMatrix * normal);
        vLocalPosition = position;

        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;

        gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
`

const fragmentShader = `
    precision highp float;

    uniform float uTime;
    uniform int uType;

    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec3 vLocalPosition;

    float hash(vec3 p) {
        p = fract(p * 0.3183 + vec3(0.1,0.2,0.3));
        p *= 17.0;
        return fract(p.x*p.y*p.z*(p.x+p.y+p.z));
    }

    float noise(vec3 p) {
        vec3 i = floor(p);
        vec3 f = fract(p);
        f = f*f*(3.0-2.0*f);

        float n = mix(
            mix(mix(hash(i), hash(i+vec3(1,0,0)), f.x),
                mix(hash(i+vec3(0,1,0)), hash(i+vec3(1,1,0)), f.x), f.y),
            mix(mix(hash(i+vec3(0,0,1)), hash(i+vec3(1,0,1)), f.x),
                mix(hash(i+vec3(0,1,1)), hash(i+vec3(1,1,1)), f.x), f.y),
            f.z
        );

        return n;
    }

    float fbm(vec3 p) {
        float v = 0.0;
        float a = 0.5;

        for(int i=0;i<3;i++){
            v += a * noise(p);
            p *= 2.0;
            a *= 0.5;
        }

        return v;
    }

    vec3 flowField(vec3 p, float t) {
        vec3 dir;
        dir.x = fbm(p + vec3(0.0, t, 0.0));
        dir.y = fbm(p + vec3(t, 0.0, 0.0));
        dir.z = fbm(p + vec3(0.0, 0.0, t));
        return normalize(dir - 0.5);
    }

    void main() {
        float t = uTime * 0.5;

        vec3 N = normalize(vNormal);
        vec3 V = normalize(cameraPosition - vWorldPosition);

        vec3 p = normalize(vLocalPosition);

        if (uType == 0) {
            float dist = length(vLocalPosition);
            float density = 1.0 - dist * 1.4;
            density = clamp(density, 0.0, 1.0);

            vec3 q = p * 3.0;
            vec3 flow = flowField(q, t * 0.6);
            q += flow * 1.2;

            float n1 = fbm(q);
            float n2 = fbm(q * 1.7 - t * 0.3);

            float energy = mix(n1, n2, 0.5);
            float brightness = density + energy * 0.6;

            vec3 colA = vec3(0.02, 0.03, 0.08);
            vec3 colB = vec3(0.2, 0.5, 1.0);
            vec3 color = mix(colA, colB, brightness);

            float boosted = pow(brightness, 0.7);
            vec3 emission = color * boosted * 6.0;

            gl_FragColor = vec4(emission, 1.0);
            return;
        }

        if (uType == 1) {
            float fresnel = 1.0 - dot(N, V);
            fresnel = pow(fresnel, 2.0);

            vec3 q = p * 2.0;
            vec3 flow = flowField(q, t * 0.6);
            q += flow * 1.5;

            float n = fbm(q);
            vec3 cell = fract(q * 3.0);
            float vor = length(cell - 0.5);
            vor = smoothstep(0.2, 0.5, vor);

            float motion = mix(n, vor, 0.5);
            motion = sin(motion * 8.0 + t * 3.0);

            motion = 0.3 * motion + 0.7;

            float shell = fresnel * (0.6 + motion * 0.9);

            vec3 base = vec3(0.01, 0.02, 0.05);
            vec3 glow = vec3(0.3, 0.7, 1.2);
            vec3 color = mix(base, glow, shell);

            vec3 emission = color * shell * 1.5;
            float alpha = clamp(shell, 0.0, 1.0);

            gl_FragColor = vec4(emission, alpha);
            return;
        }

        gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
    }
`

// UTILS -------------------------------------------------------------------------------------------------------------------------------------------|
import { ASSET_MANIFEST, LOADER_CONFIG, animateProgress, preloadAssets } from '../../../utils/preLoaderUtils'

// MODEL CONTROLS ----------------------------------------------------------------------------------------------------------------------------------|
const ModelControls = {
    position: { x: 0, y: 0.5, z: 0 },
    scale: 0.8,
}

// PARTICLE CONTROLS -------------------------------------------------------------------------------------------------------------------------------|
const ParticleControls = {
    count: 500,
    size: 0.03,
    baseOpacity: 0.2,
    twinkleSpeed: 0.8,
    speed: { x: 0.02, y: 0.05 },
    spread: { x: 15, y: 15, z: 10 },
    explodeSpeed: 8
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
                        uType: { value: 0 }
                    }
                })
            }
            if (child.name === "Shell") {
                child.material = new ShaderMaterial({
                    vertexShader,
                    fragmentShader,
                    uniforms: {
                        uTime: { value: 0 },
                        uType: { value: 1 }
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
    const cyanPointsRef = useRef()
    const violetPointsRef = useRef()
    const cyanMaterialRef = useRef()
    const violetMaterialRef = useRef()

    const cyanCount = Math.floor(ParticleControls.count * 0.7)
    const violetCount = ParticleControls.count - cyanCount

    const { positions: cyanPositions, velocities: cyanVelocities } = useMemo(() => {
        const pos = new Float32Array(cyanCount * 3)
        const vel = new Float32Array(cyanCount * 3)
        for (let i = 0; i < cyanCount; i++) {
            pos[i * 3] = (Math.random() - 0.5) * ParticleControls.spread.x
            pos[i * 3 + 1] = (Math.random() - 0.5) * ParticleControls.spread.y
            pos[i * 3 + 2] = (Math.random() - 0.5) * ParticleControls.spread.z
            vel[i * 3] = (Math.random() - 0.5) * 2
            vel[i * 3 + 1] = (Math.random() - 0.5) * 2
            vel[i * 3 + 2] = (Math.random() - 0.5) * 2
        }
        return { positions: pos, velocities: vel }
    }, [cyanCount])

    const { positions: violetPositions, velocities: violetVelocities } = useMemo(() => {
        const pos = new Float32Array(violetCount * 3)
        const vel = new Float32Array(violetCount * 3)
        for (let i = 0; i < violetCount; i++) {
            pos[i * 3] = (Math.random() - 0.5) * ParticleControls.spread.x
            pos[i * 3 + 1] = (Math.random() - 0.5) * ParticleControls.spread.y
            pos[i * 3 + 2] = (Math.random() - 0.5) * ParticleControls.spread.z
            vel[i * 3] = (Math.random() - 0.5) * 2
            vel[i * 3 + 1] = (Math.random() - 0.5) * 2
            vel[i * 3 + 2] = (Math.random() - 0.5) * 2
        }
        return { positions: pos, velocities: vel }
    }, [violetCount])

    useFrame((state, delta) => {
        const t = state.clock.getElapsedTime()

        if (explodingRef?.current) {
            if (cyanPointsRef.current) {
                const pos = cyanPointsRef.current.geometry.attributes.position.array
                for (let i = 0; i < cyanCount; i++) {
                    pos[i * 3] += cyanVelocities[i * 3] * delta * ParticleControls.explodeSpeed
                    pos[i * 3 + 1] += cyanVelocities[i * 3 + 1] * delta * ParticleControls.explodeSpeed
                    pos[i * 3 + 2] += cyanVelocities[i * 3 + 2] * delta * ParticleControls.explodeSpeed
                }
                cyanPointsRef.current.geometry.attributes.position.needsUpdate = true
            }

            if (violetPointsRef.current) {
                const pos = violetPointsRef.current.geometry.attributes.position.array
                for (let i = 0; i < violetCount; i++) {
                    pos[i * 3] += violetVelocities[i * 3] * delta * ParticleControls.explodeSpeed
                    pos[i * 3 + 1] += violetVelocities[i * 3 + 1] * delta * ParticleControls.explodeSpeed
                    pos[i * 3 + 2] += violetVelocities[i * 3 + 2] * delta * ParticleControls.explodeSpeed
                }
                violetPointsRef.current.geometry.attributes.position.needsUpdate = true
            }

            if (cyanMaterialRef.current) {
                cyanMaterialRef.current.opacity = Math.max(0, cyanMaterialRef.current.opacity - delta * 2.5)
            }

            if (violetMaterialRef.current) {
                violetMaterialRef.current.opacity = Math.max(0, violetMaterialRef.current.opacity - delta * 2.5)
            }
        } else {
            if (cyanPointsRef.current) {
                cyanPointsRef.current.rotation.y += delta * ParticleControls.speed.y
                cyanPointsRef.current.rotation.x += delta * ParticleControls.speed.x
            }

            if (violetPointsRef.current) {
                violetPointsRef.current.rotation.y += delta * ParticleControls.speed.y
                violetPointsRef.current.rotation.x += delta * ParticleControls.speed.x
            }

            if (cyanMaterialRef.current) {
                cyanMaterialRef.current.opacity = ParticleControls.baseOpacity + Math.abs(Math.sin(t * ParticleControls.twinkleSpeed)) * 0.2
            }

            if (violetMaterialRef.current) {
                violetMaterialRef.current.opacity = (ParticleControls.baseOpacity * 0.8) + Math.abs(Math.sin(t * (ParticleControls.twinkleSpeed + 0.3))) * 0.15
            }
        }
    })

    return (
        <>
            <points ref = {cyanPointsRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach = "attributes-position"
                        count = {cyanPositions.length / 3}
                        array = {cyanPositions}
                        itemSize = {3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    ref = {cyanMaterialRef}
                    size = {ParticleControls.size}
                    color = "#2DE2E6"
                    transparent = {true}
                    opacity = {ParticleControls.baseOpacity}
                    depthWrite = {false}
                    sizeAttenuation = {true}
                    blending = {2}
                />
            </points>

            <points ref = {violetPointsRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach = "attributes-position"
                        count = {violetPositions.length / 3}
                        array = {violetPositions}
                        itemSize = {3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    ref = {violetMaterialRef}
                    size = {ParticleControls.size * 0.9}
                    color = "#7C5CFF"
                    transparent = {true}
                    opacity = {ParticleControls.baseOpacity * 0.8}
                    depthWrite = {false}
                    sizeAttenuation = {true}
                    blending = {2}
                />
            </points>
        </>
    )
}

// HUD OVERLAY -------------------------------------------------------------------------------------------------------------------------------------|
function HudOverlay({ progress, isExiting }) {
    const microStars = useMemo(() => [...Array(50)].map((_, i) => ({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 1.5
    })), [])

    return (
        <motion.div
            className = {styles['hud-overlay']}
            initial = {{ opacity: 0 }}
            animate = {{ opacity: isExiting ? 0 : 1 }}
            transition = {{ duration: isExiting ? 0.3 : 0.9, delay: isExiting ? 0 : 0.4, ease: 'easeOut' }}
        >
            {microStars.map(star => (
                <motion.div
                    key = {star.id}
                    className = {styles['micro-star']}
                    initial = {{ opacity: 0 }}
                    animate = {{ opacity: [0.1, 0.6, 0.1] }}
                    transition = {{ duration: star.duration, repeat: Infinity, delay: star.delay }}
                    style = {{ top: star.top, left: star.left }}
                />
            ))}

            <motion.div
                className = {styles['corner-brackets']}
                animate = {{ opacity: 0.5, scale: 1 }}
                transition = {{ duration: 0.9, ease: 'easeOut' }}
            >
                <div className = {`${styles['bracket']} ${styles['top-left']}`} />
                <div className = {`${styles['bracket']} ${styles['top-right']}`} />
                <div className = {`${styles['bracket']} ${styles['bottom-left']}`} />
                <div className = {`${styles['bracket']} ${styles['bottom-right']}`} />
            </motion.div>

            <div className = {`${styles['scanline-container']} ${styles['left']}`}>
                <motion.div
                    animate = {{ top: ['0%', '100%'], opacity: [0, 1, 0] }}
                    transition = {{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    className = {styles['scanline']}
                />
            </div>

            <div className = {`${styles['scanline-container']} ${styles['right']}`}>
                <motion.div
                    animate = {{ bottom: ['0%', '100%'], opacity: [0, 1, 0] }}
                    transition = {{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    className = {`${styles['scanline']} ${styles['reverse']}`}
                />
            </div>

            <div className = {styles['center-loader-container']}>
                <motion.div
                    className = {styles['loader-line-glow']}
                    animate = {{
                        width: ["0px", "180px", "140px", "200px", "0px"],
                        opacity: [0, 1, 0.8, 1, 0]
                    }}
                    transition = {{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className = {styles['loader-line-base']} />
                <motion.div
                    className = {styles['loader-subtext']}
                    animate = {{ opacity: [0.3, 1, 0.3] }}
                    transition = {{ duration: 2, repeat: Infinity }}
                >
                    {progress >= 100 ? 'ALL SYSTEMS NOMINAL' : 'CALIBRATING SYSTEMS'}
                </motion.div>
                {progress >= 100 && (
                    <motion.div
                        className = {styles['click-anywhere-text']}
                        initial = {{ opacity: 0 }}
                        animate = {{ opacity: 1 }}
                        transition = {{ duration: 0.6, ease: 'easeOut' }}
                    >
                        CLICK ANYWHERE
                    </motion.div>
                )}
            </div>

            <motion.div
                className = {`${styles['telemetry']} ${styles['top-left']}`}
                initial = {{ opacity: 0, x: -12 }}
                animate = {{ opacity: 1, x: 0 }}
                transition = {{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            >
                <span className = {styles['status-label']}>SYSTEM STATUS: NOMINAL</span>
                <div className = {styles['data-row']}>
                    <span className = {styles['data-text']}>LAT: 40.7128° N</span>
                </div>
            </motion.div>

            <motion.div
                className = {`${styles['telemetry']} ${styles['bottom-right']}`}
                initial = {{ opacity: 0, x: 12 }}
                animate = {{ opacity: 1, x: 0 }}
                transition = {{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            >
                <div className = {styles['percentage-container']}>
                    <span className = {styles['percentage-label']}>PROCESSING</span>
                    <span className = {styles['percentage-value']}>{progress.toString().padStart(2, '0')}%</span>
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
            className = {styles['preloader-container']}
            initial = {{ opacity: 0 }}
            animate = {
                phase === 'exiting'
                    ? { opacity: 0, scale: 1.07 }
                    : { opacity: 1, scale: 1 }
            }
            transition = {
                phase === 'exiting'
                    ? { duration: LOADER_CONFIG.exit.duration / 1000, ease: 'easeIn' }
                    : { duration: 1.2, ease: 'easeOut', delay: 0.05 }
            }
            onClick = {phase === 'ready' ? handleEnter : undefined}
            style = {{ cursor: phase === 'ready' ? 'pointer' : 'default' }}
        >
            <Canvas camera = {{ position: [0, 0, 5], fov: 50 }} dpr = {[1, 1.5]} gl = {{ antialias: true, alpha: true, powerPreference: 'high-performance' }}>
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

            <motion.div
                className = {styles['exit-blur-overlay']}
                initial = {{ opacity: 0, backdropFilter: 'blur(0px)' }}
                animate = {
                    phase === 'exiting'
                        ? { opacity: 1, backdropFilter: 'blur(18px)' }
                        : { opacity: 0, backdropFilter: 'blur(0px)' }
                }
                transition = {{ duration: LOADER_CONFIG.exit.duration / 1000, ease: 'easeIn' }}
                onAnimationComplete = {handleAnimationComplete}
            />
        </motion.div>
    )
}

// EXPORTS -----------------------------------------------------------------------------------------------------------------------------------------|
export default PreLoader

// MODEL PRELOAD -----------------------------------------------------------------------------------------------------------------------------------|
ASSET_MANIFEST.models.forEach(path => useGLTF.preload(path))
