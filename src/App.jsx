// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { useState } from 'react'

// COMPONENTS --------------------------------------------------------------------------------------------------------------------------------------|
import Cursor from './components/common/Cursor'
import PreLoader from './components/common/PreLoader'

// APPLICATION -------------------------------------------------------------------------------------------------------------------------------------|
function App() {
    const [loading, setLoading] = useState(true)

    return (
        <div className = "min-h-screen bg-black">
            {/* Custom cursor */}
            <Cursor isSystemLoading = {loading} />

            {/* Loading screen */}
            {loading && <PreLoader onComplete = {() => setLoading(false)} />}
            
            {/* Main content */}
            <main>
                
            </main>
        </div>
    )
}

// EXPORTS -----------------------------------------------------------------------------------------------------------------------------------------|
export default App
