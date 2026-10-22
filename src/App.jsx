// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { Routes, Route } from "react-router"

// COMPONENTS --------------------------------------------------------------------------------------------------------------------------------------|
import AppLayout from "./components/Layout/AppLayout.jsx"
import Cursor from "./components/Common/Cursor/Cursor.jsx"

// PAGES -------------------------------------------------------------------------------------------------------------------------------------------|
import Home from "./pages/Home/Home.jsx"
import Resume from "./pages/Resume/Resume.jsx"
import NotFound from "./pages/NotFound/NotFound.jsx"

// APPLICATION -------------------------------------------------------------------------------------------------------------------------------------|
export default function App() {
    return (
        <>
            <Cursor />
            <Routes>
                <Route element = {<AppLayout />}>
                    <Route path = "/" element = {<Home />} />
                    <Route path = "/resume" element = {<Resume />} />

                    <Route path = "*" element = {<NotFound />} />
                </Route>
            </Routes>
        </>
    )
}
