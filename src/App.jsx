// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { useState } from 'react'

// COMPONENTS --------------------------------------------------------------------------------------------------------------------------------------|
import Cursor from './components/common/Cursor'
import PreLoader from './components/common/PreLoader'

// SECTIONS ----------------------------------------------------------------------------------------------------------------------------------------|
import HomeSection from './sections/Home'
import AboutSection from './sections/About'
import SkillsSection from './sections/Skills'
import ContactSection from './sections/Contact'
import ProjectsSection from './sections/Projects'

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
                {/* Navbar */}


                {/* Portfolio sections */}
                <HomeSection />
                <AboutSection />
                <SkillsSection />
                <ProjectsSection />
                <ContactSection />

                {/* Footer */}

            </main>
        </div>
    )
}

// EXPORTS -----------------------------------------------------------------------------------------------------------------------------------------|
export default App
