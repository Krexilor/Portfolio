// COMPONENTS --------------------------------------------------------------------------------------------------------------------------------------|
import ChapterRail from "../../components/Common/ChapterRail/ChapterRail.jsx"

// SECTIONS ----------------------------------------------------------------------------------------------------------------------------------------|
import Home from "../../sections/Home/Home.jsx"
import About from "../../sections/About/About.jsx"
import Work from "../../sections/Work/Work.jsx"
import Lab from "../../sections/Lab/Lab.jsx"
import Contact from "../../sections/Contact/Contact.jsx"

// STYLES ------------------------------------------------------------------------------------------------------------------------------------------|
import styles from "./Landing.module.css"

// LANDING PAGE ------------------------------------------------------------------------------------------------------------------------------------|
export default function Landing() {
    return (
        <main className = {styles.main}>
            <ChapterRail />
            <Home />
            <About />
            <Work />
            <Lab />
            <Contact />
        </main>
    )
}
