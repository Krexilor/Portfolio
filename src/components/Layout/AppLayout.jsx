// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { Outlet } from "react-router"

// COMPONENTS --------------------------------------------------------------------------------------------------------------------------------------|
import Navbar from "./Navbar/Navbar.jsx"
import Footer from "./Footer/Footer.jsx"
import ScrollToHash from "./ScrollToHash.jsx"

// APP LAYOUT --------------------------------------------------------------------------------------------------------------------------------------|
export default function AppLayout() {
    return (
        <>
            <ScrollToHash />
            <Navbar />
            <Outlet />
            <Footer />
        </>
    )
}
