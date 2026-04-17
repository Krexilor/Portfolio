// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'

// COMPONENTS --------------------------------------------------------------------------------------------------------------------------------------|
import Cursor from './components/common/Cursor'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import PreLoader from './components/common/PreLoader'

// SECTIONS ----------------------------------------------------------------------------------------------------------------------------------------|
import HomeSection from './sections/Home'
import WorkSection from './sections/Work'
import AboutSection from './sections/About'
import ContactSection from './sections/Contact'
import ProcessSection from './sections/Process'

// PAGES --------------------------------------------------------------------------------------------------------------------------------------------|
import Blog from './pages/Blog'
import Resume from './pages/Resume'

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

    const location = useLocation()
    const isDetailPage = location.pathname === '/blog' || location.pathname === '/resume'

    return (
        <div className = "min-h-screen bg-black">
            {/* Custom cursor */}
            <Cursor isSystemLoading = {loading} />

            {/* Loading screen */}
            {loading && <PreLoader onComplete = {() => setLoading(false)} />}
            
            {/* Main content - only render when loading is complete */}
            {!loading && (
                <main>
                    {!isDetailPage && <Navbar />}

                    <Routes>
                        <Route path = "/" element = {
                            <>
                                <HomeSection />
                                <AboutSection />
                                <WorkSection />
                                <ProcessSection />
                                <ContactSection />
                                <Footer />
                            </>
                        } />
                        <Route path = "/blog" element = {<Blog />} />
                        <Route path = "/resume" element = {<Resume />} />
                        <Route path = "*" element = {
                            <>
                                <HomeSection />
                                <AboutSection />
                                <WorkSection />
                                <ProcessSection />
                                <ContactSection />
                                <Footer />
                            </>
                        } />
                    </Routes>
                </main>
            )}
        </div>
    )
}

// EXPORTS -----------------------------------------------------------------------------------------------------------------------------------------|
export default App
