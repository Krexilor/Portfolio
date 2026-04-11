// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { useState } from 'react'

// COMPONENTS --------------------------------------------------------------------------------------------------------------------------------------|
import PreLoader from './components/common/PreLoader'

// APPLICATION -------------------------------------------------------------------------------------------------------------------------------------|
function App() {
    const [loading, setLoading] = useState(true)

    return (
        <div className = "min-h-screen bg-black">
            {/* Loading screen */}
            {loading && <PreLoader onComplete = {() => setLoading(false)} />}
            <main>
                
            </main>
        </div>
    )
}

// EXPORTS -----------------------------------------------------------------------------------------------------------------------------------------|
export default App
