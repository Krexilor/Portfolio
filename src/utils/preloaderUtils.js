// ASSET MANIFEST ----------------------------------------------------------------------------------------------------------------------------------|
export const ASSET_MANIFEST = {
    models: [
        // '/src/assets/models/example.glb'
    ],
    images: [
        // '/src/assets/images/example.jpg',
    ],
    textures: [
        // '/src/assets/textures/example.png',
    ],
}

// LOADER CONFIG -----------------------------------------------------------------------------------------------------------------------------------|
export const LOADER_CONFIG = {
    simulated: {
        target: 70,
        duration: 2800,
    },
    real: {
        start: 70,
        end: 100,
    },
    entry: {
        duration: 800,
    },
    exit: {
        duration: 900,
    },
}

// EASING ------------------------------------------------------------------------------------------------------------------------------------------|
function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3)
}

// PROGRESS ANIMATION ------------------------------------------------------------------------------------------------------------------------------|
export function animateProgress(from, to, duration, onUpdate) {
    const startTime = performance.now()
    let rafId

    function tick(now) {
        const t = Math.min((now - startTime) / duration, 1)
        onUpdate(Math.round(from + (to - from) * easeOutCubic(t)))
        if (t < 1) rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
}

// ASSET PRELOADER ------------------------------------------------------------------------------------------------------------------------------|
export async function preloadAssets(onProgress) {
    const all = [
        ...ASSET_MANIFEST.models,
        ...ASSET_MANIFEST.images,
        ...ASSET_MANIFEST.textures,
    ]

    const { real } = LOADER_CONFIG
    const range = real.end - real.start

    if (all.length === 0) {
        onProgress(real.end)
        return
    }

    let loaded = 0

    await Promise.all(
        all.map(async (url) => {
            try {
                await fetch(url, { method: 'HEAD' })
            } catch (_) {}
            loaded++
            onProgress(Math.round(real.start + (loaded / all.length) * range))
        })
    )
}
