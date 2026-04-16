// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { useState, useEffect } from 'react'

// COMPONENTS --------------------------------------------------------------------------------------------------------------------------------------|
import Cursor from './components/common/Cursor'
import PreLoader from './components/common/PreLoader'

// SECTIONS ----------------------------------------------------------------------------------------------------------------------------------------|
import HomeSection from './sections/Home'
import AboutSection from './sections/About'
import ContactSection from './sections/Contact'
import ProcessSection from './sections/Process'
import WorkSection from './sections/Work'

// APPLICATION -------------------------------------------------------------------------------------------------------------------------------------|
function App() {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (loading) {
            document.documentElement.style.overflow = 'hidden'
        } else {
            document.documentElement.style.overflow = 'auto'
        }

        return () => {
            document.documentElement.style.overflow = 'auto'
        }
    }, [loading])

    return (
        <div className = "min-h-screen bg-black">
            {/* Custom cursor */}
            <Cursor isSystemLoading = {loading} />

            {/* Loading screen */}
            {loading && <PreLoader onComplete = {() => setLoading(false)} />}
            
            {/* Main content - only render when loading is complete */}
            {!loading && (
                <main>
                    {/* Navbar */}


                    {/* Portfolio sections */}
                    <HomeSection />
                    <AboutSection />
                    <ProjectsSection />
                    <ContactSection />

                    {/* Footer */}

                </main>
            )}
        </div>
    )
}

// EXPORTS -----------------------------------------------------------------------------------------------------------------------------------------|
export default App
