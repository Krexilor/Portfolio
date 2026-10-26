// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { Routes, Route } from "react-router"

// COMPONENTS --------------------------------------------------------------------------------------------------------------------------------------|
import AppLayout from "./components/Layout/AppLayout.jsx"
import Cursor from "./components/Common/Cursor/Cursor.jsx"

// PAGES -------------------------------------------------------------------------------------------------------------------------------------------|
import Resume from "./pages/Resume/Resume.jsx"
import Landing from "./pages/Landing/Landing.jsx"
import NotFound from "./pages/NotFound/NotFound.jsx"

// APPLICATION -------------------------------------------------------------------------------------------------------------------------------------|
export default function App() {
    return (
        <>
            <Cursor />
            <Routes>
                <Route element = {<AppLayout />}>
                    <Route path = "/" element = {<Landing />} />
                    <Route path = "/resume" element = {<Resume />} />
                </Route>

                <Route path = "*" element = {<NotFound />} />
            </Routes>
        </>
    )
}
