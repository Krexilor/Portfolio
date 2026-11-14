// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { Routes, Route } from "react-router"

// COMPONENTS --------------------------------------------------------------------------------------------------------------------------------------|
import AppLayout from "./components/Layout/AppLayout.jsx"
import Cursor from "./components/Common/Cursor/Cursor.jsx"

// PAGES -------------------------------------------------------------------------------------------------------------------------------------------|
import Blog from "./pages/Blog/Blog.jsx"
import Resume from "./pages/Resume/Resume.jsx"
import BlogPost from "./pages/Blog/BlogPost.jsx"
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
                    <Route path = "/blog" element = {<Blog />} />
                    <Route path = "/blog/:slug" element = {<BlogPost />} />
                    <Route path = "/resume" element = {<Resume />} />
                </Route>

                <Route path = "*" element = {<NotFound />} />
            </Routes>
        </>
    )
}
