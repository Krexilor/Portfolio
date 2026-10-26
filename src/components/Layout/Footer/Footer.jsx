// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { Link } from "react-router"

// COMPONENTS --------------------------------------------------------------------------------------------------------------------------------------|
import { BackToTopBtn } from "../../Common/Buttons/Buttons.jsx"

// DATA --------------------------------------------------------------------------------------------------------------------------------------------|
import { wordmark } from "../../../data/wordmark.js"

// STYLES ------------------------------------------------------------------------------------------------------------------------------------------|
import styles from "./Footer.module.css"

// FOOTER DATA -------------------------------------------------------------------------------------------------------------------------------------|
const YEAR = new Date().getFullYear()
const EMAIL = "aarav.malik.pro@gmail.com"

const sectionLinks = [
    { hash: "#home", label: "Home" },
    { hash: "#about", label: "About" },
    { hash: "#work", label: "Work" },
    { hash: "#stack", label: "Stack" },
    { hash: "#explore", label: "Explore" },
    { hash: "#notes", label: "Notes" },
    { hash: "#contact", label: "Contact" }
]

const pageLinks = [
    { to: "/resume", label: "Resume" }
]

const connectLinks = [
    { href: `mailto:${EMAIL}`, label: EMAIL },
    { href: "https://github.com/Krexilor", label: "GitHub", external: true },
    { href: "https://www.linkedin.com/in/aaravmalik-pro/", label: "LinkedIn", external: true },
    { href: "https://leetcode.com/u/Krexilor/", label: "LeetCode", external: true }
]

// EXTERNAL LINK ARROW -----------------------------------------------------------------------------------------------------------------------------|
function ArrowUpRight() {
    return (
        <svg
            className = {styles.arrow}
            viewBox = "0 0 16 16"
            width = "11"
            height = "11"
            fill = "none"
            stroke = "currentColor"
            strokeWidth = "1.6"
            strokeLinecap = "round"
            strokeLinejoin = "round"
            aria-hidden = "true"
        >
            <path d = "M4 12L12 4M5.5 4H12V10.5" />
        </svg>
    )
}

// FOOTER ------------------------------------------------------------------------------------------------------------------------------------------|
export default function Footer() {
    return (
        <footer className = {styles.footer}>
            <div className = {styles.container}>
                <div className = {styles.topLine} aria-hidden = "true" />

                <div className = {styles.grid}>

                    {/* Brand */}
                    <div className = {styles.brand}>
                        <Link
                            to = {{ pathname: "/", hash: "#home" }}
                            className = {styles.brandLink}
                            aria-label = "Krexilor Home"
                        >
                            <svg
                                className = {styles.wordmark}
                                viewBox = "0 0 118 24"
                                fill = "none"
                                stroke = "currentColor"
                                strokeWidth = "3"
                                strokeLinecap = "round"
                                strokeLinejoin = "round"
                                xmlns = "http://www.w3.org/2000/svg"
                                aria-hidden = "true"
                            >
                                {wordmark.map((letter, index) => (
                                    <g key = {index}>
                                        {letter.paths.map((d) => (
                                            <path
                                                key = {d}
                                                d = {d}
                                                stroke = {letter.accent ? "var(--color-accent)" : "currentColor"}
                                            />
                                        ))}
                                    </g>
                                ))}
                            </svg>
                        </Link>

                        <p className = {styles.tagline}>Understanding software, from the inside out.</p>
                        <p className = {styles.interests}>Systems · Backend · Networks</p>
                    </div>

                    {/* Landing sections */}
                    <nav className = {styles.sections} aria-label = "Footer sections">
                        <p className = {styles.heading}>Sections</p>
                        <ul className = {`${styles.list} ${styles.listColumns}`}>
                            {sectionLinks.map((item) => (
                                <li key = {item.hash}>
                                    <Link to = {{ pathname: "/", hash: item.hash }} className = {styles.link}>
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Separate pages */}
                    <nav className = {styles.pages} aria-label = "Footer pages">
                        <p className = {styles.heading}>Pages</p>
                        <ul className = {styles.list}>
                            {pageLinks.map((item) => (
                                <li key = {item.to}>
                                    <Link to = {item.to} className = {styles.link}>
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Contact and profiles */}
                    <div className = {styles.connect} role = "group" aria-label = "Connect">
                        <p className = {styles.heading}>Connect</p>
                        <ul className = {styles.list}>
                            {connectLinks.map((item) => (
                                <li key = {item.label}>
                                    <a
                                        href = {item.href}
                                        className = {styles.link}
                                        {...(item.external && { target: "_blank", rel: "noopener noreferrer" })}
                                    >
                                        {item.label}
                                        {item.external && <ArrowUpRight />}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>

                <div className = {styles.bottomBar}>
                    <small className = {styles.meta}>© {YEAR} Aarav Malik</small>
                    <small className = {styles.meta}>Built with React and Vite</small>
                    <BackToTopBtn />
                </div>
            </div>
        </footer>
    )
}
