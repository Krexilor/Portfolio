// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { ShaderMaterial } from 'three'
import { useRef, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'

// STYLES ------------------------------------------------------------------------------------------------------------------------------------------|
import '../../styles/components/common/PreLoader.css'

// SHADERS -----------------------------------------------------------------------------------------------------------------------------------------|
import vertexShader from '../../shaders/PreLoader/vertex.glsl'
import fragmentShader from '../../shaders/PreLoader/fragment.glsl'

// MODEL CONTROLS ----------------------------------------------------------------------------------------------------------------------------------|
const ModelControls = {
    position: { x: 0, y: 0.5, z: 0 },
    scale: 0.8
}

// PARTICLE CONTROLS -------------------------------------------------------------------------------------------------------------------------------|
const ParticleControls = {
    count: 1000,
    size: 0.03,
    color: "#88ccff",
    baseOpacity: 0.2,
    twinkleSpeed: 0.8,
    speed: { x: 0.02, y: 0.05 },
    spread: { x: 15, y: 15, z: 10 }
}

// BACKGROUND DUST ---------------------------------------------------------------------------------------------------------------------------------|
function DustParticles() {
    const pointsRef = useRef()
    const materialRef = useRef()

    const particlesPosition = useMemo(() => {
        const positions = new Float32Array(ParticleControls.count * 3)
        for (let i = 0; i < ParticleControls.count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * ParticleControls.spread.x     
            positions[i * 3 + 1] = (Math.random() - 0.5) * ParticleControls.spread.y 
            positions[i * 3 + 2] = (Math.random() - 0.5) * ParticleControls.spread.z 
        }
        return positions
    }, [])

    useFrame((state, delta) => {
        const t = state.clock.getElapsedTime()
        
        if (pointsRef.current) {
            pointsRef.current.rotation.y += delta * ParticleControls.speed.y
            pointsRef.current.rotation.x += delta * ParticleControls.speed.x
        }

        if (materialRef.current) {
            materialRef.current.opacity = ParticleControls.baseOpacity + Math.abs(Math.sin(t * ParticleControls.twinkleSpeed)) * 0.2
        }
    })

    return (
        <points ref = {pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach = "attributes-position"
                    count = {particlesPosition.length / 3}
                    array = {particlesPosition}
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
                        uType: { value: 1}
                    },
                    transparent: true,
                    toneMapped: false
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

// PRELOADER COMPONENT -----------------------------------------------------------------------------------------------------------------------------|
function PreLoader() {
    return (
        <div className = "preloader-container">
            <Canvas camera = {{ position: [0, 0, 5], fov: 50}}>    
                <ambientLight intensity = {0.2} />
                
                <DustParticles />
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
        </div>
    )
}

// EXPORTS -----------------------------------------------------------------------------------------------------------------------------------------|
export default PreLoader
