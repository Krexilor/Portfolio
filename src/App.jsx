// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { Routes, Route } from "react-router"

// PAGES -------------------------------------------------------------------------------------------------------------------------------------------|
import Home from "./pages/Home/Home.jsx"
import Resume from "./pages/Resume/Resume.jsx"
import NotFound from "./pages/NotFound/NotFound.jsx"

// APPLICATION -------------------------------------------------------------------------------------------------------------------------------------|
export default function App() {
    return (
        <Routes>
            <Route path = "/" element = {<Home />} />
            <Route path = "/resume" element = {<Resume />} />

            <Route path = "*" element = {<NotFound />} />
        </Routes>
    )
}
