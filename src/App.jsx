// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { useState, useEffect } from 'react'

// COMPONENTS --------------------------------------------------------------------------------------------------------------------------------------|
import Cursor from './components/common/Cursor'
import PreLoader from './components/common/PreLoader'

// APPLICATION -------------------------------------------------------------------------------------------------------------------------------------|
function App() {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        document.documentElement.style.overflow = loading ? 'hidden' : 'auto'

        return () => {
            document.documentElement.style.overflow = 'auto'
        }
    }, [loading])

    return (
        <div className = "min-h-screen bg-black">
            {/* Custom cursor */}
            <Cursor isSystemLoading = {loading} />

            {/* Loading screen */}
            {loading && <PreLoader onComplete={() => setLoading(false)} />}

            {/* Main content placeholder */}
            {!loading && (
                <main>
                    {/* Add your current page or section components here */}
                </main>
            )}
        </div>
    )
}

// EXPORTS -----------------------------------------------------------------------------------------------------------------------------------------|
export default App
