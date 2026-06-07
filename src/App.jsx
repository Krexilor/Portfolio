// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { useState, useEffect } from 'react'

// COMPONENTS --------------------------------------------------------------------------------------------------------------------------------------|
import Cursor from './components/common/Cursor/Cursor.jsx' 
import PreLoader from './components/common/PreLoader/PreLoader.jsx'

import Navbar from './components/layout/Navbar/Navbar.jsx'

// SECTIONS ----------------------------------------------------------------------------------------------------------------------------------------|
import Home from './sections/Home/Home.jsx'
import About from './sections/About/About.jsx'
import Skills from './sections/Skills/Skills.jsx'
import Contact from './sections/Contact/Contact.jsx'
import Projects from './sections/Projects/Projects.jsx'
import Achievement from './sections/Achievements/Achievements.jsx'

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

            {/* Main content */}
            {!loading && (
                <>
                    <Navbar />
                    <main>
                        <Home />
                        <About />
                        <Skills />
                        <Projects />
                        <Achievement />
                        <Contact />
                    </main>
                </>
            )}
        </div>
    )
}

// EXPORTS -----------------------------------------------------------------------------------------------------------------------------------------|
export default App
