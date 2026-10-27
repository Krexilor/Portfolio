// COMPONENTS --------------------------------------------------------------------------------------------------------------------------------------|
import { BackToTopBtn } from "../../Common/Buttons/Buttons.jsx"

// DATA --------------------------------------------------------------------------------------------------------------------------------------------|
import { profile } from "../../../data/profile.js"

// STYLES ------------------------------------------------------------------------------------------------------------------------------------------|
import styles from "./Footer.module.css"

// CONSTANTS ---------------------------------------------------------------------------------------------------------------------------------------|
const YEAR = new Date().getFullYear()

// FOOTER ------------------------------------------------------------------------------------------------------------------------------------------|
export default function Footer() {
    return (
        <footer className = {styles.footer}>
            <div className = {styles.inner}>
                <small className = {`${styles.meta} ${styles.copyright}`}>© {YEAR} {profile.name}</small>
                <small className = {`${styles.meta} ${styles.credit}`}>Built with React and Vite</small>
                <BackToTopBtn className = {styles.backToTop} />
            </div>
        </footer>
    )
}
