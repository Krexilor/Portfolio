// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|


// SECTIONS ----------------------------------------------------------------------------------------------------------------------------------------|
import Work from "../../sections/Work/Work.jsx"
import Home from "../../sections/Home/Home.jsx"
import Notes from "../../sections/Notes/Notes.jsx"
import Stack from "../../sections/Stack/Stack.jsx"
import About from "../../sections/About/About.jsx"
import Contact from "../../sections/Contact/Contact.jsx"
import Explore from "../../sections/Explore/Explore.jsx"

// STYLES ------------------------------------------------------------------------------------------------------------------------------------------|
import styles from "./Landing.module.css"

// LANDING PAGE ------------------------------------------------------------------------------------------------------------------------------------|
export default function Landing() {
    return (
        <main style = {styles.main}>
            <Home />
            <About />
            <Work />
            <Stack />
            <Explore />
            <Notes />
            <Contact />
        </main>
    )
}
