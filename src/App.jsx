// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'

// PAGES -------------------------------------------------------------------------------------------------------------------------------------------|
import Landing from './sections/Landing.jsx'
import Resume from './pages/Resume/Resume.jsx'
import NotFound from './pages/NotFound/NotFound.jsx'

// APPLICATION -------------------------------------------------------------------------------------------------------------------------------------|
export default function App() {
    useEffect(() => {
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual'
        }
        window.scrollTo(0, 0)
    }, [])
    
    return (
        <div>
            <Routes>
                <Route path = '/' element = {<Landing />} />
                <Route path = '/resume' element = {<Resume />} />
                <Route path = '*' element = {<NotFound />} />
            </Routes>
        </div>
    )
}
