// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { useState } from "react"
import { Link } from "react-router"

// COMPONENTS --------------------------------------------------------------------------------------------------------------------------------------|
import { BackToTopBtn } from "../../Common/Buttons/Buttons.jsx"

// DATA --------------------------------------------------------------------------------------------------------------------------------------------|
import { wordmark } from "../../../data/wordmark.data.js"
import { profile, socials } from "../../../data/profile.data.js"
import { sectionLinks, pageLinks } from "../../../data/navigation.data.js"

// UTILS -------------------------------------------------------------------------------------------------------------------------------------------|
import { copyTextToClipboard } from "../../../utils/contentHelpers.js"

// STYLES ------------------------------------------------------------------------------------------------------------------------------------------|
import styles from "./Footer.module.css"

// CONSTANTS ---------------------------------------------------------------------------------------------------------------------------------------|
const YEAR = new Date().getFullYear()

// FOOTER ------------------------------------------------------------------------------------------------------------------------------------------|
export default function Footer() {
    const [copied, setCopied] = useState(false)

    const handleCopyEmail = async () => {
        const ok = await copyTextToClipboard(profile.email)
        if (ok) {
            setCopied(true)
            window.setTimeout(() => setCopied(false), 2200)
        }
    }

    return (
        <footer className = {styles.footer}>
            <div className = {`container ${styles.shell}`}>
                {/* Top Signature & Quick Actions Band */}
                <div className = {styles.signatureBand}>
                    <div className = {styles.signatureLeft}>
                        <Link to = {{ pathname: "/", hash: "#home" }} className = {styles.wordmarkLink} aria-label = "Krexilor Home">
                            <svg
                                className = {styles.wordmarkSvg}
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
                        <p className = {styles.statement}>{profile.tagline}</p>
                    </div>

                    <div className = {styles.signatureActions}>
                        <button
                            type = "button"
                            className = {`${styles.copyBtn} ${copied ? styles.copyBtnDone : ""}`}
                            onClick = {handleCopyEmail}
                            aria-live = "polite"
                        >
                            {copied ? (
                                <svg className = {styles.copyIcon} viewBox = "0 0 20 20" fill = "none" aria-hidden = "true">
                                    <path
                                        d = "M4.5 10.5 L8.2 14.2 L15.5 6.5"
                                        stroke = "currentColor"
                                        strokeWidth = "2"
                                        strokeLinecap = "round"
                                        strokeLinejoin = "round"
                                    />
                                </svg>
                            ) : (
                                <svg className = {styles.copyIcon} viewBox = "0 0 20 20" fill = "none" aria-hidden = "true">
                                    <rect
                                        x = "7"
                                        y = "7"
                                        width = "9.5"
                                        height = "9.5"
                                        rx = "1.8"
                                        stroke = "currentColor"
                                        strokeWidth = "1.6"
                                    />
                                    <path
                                        d = "M13 4.5 V4 A 1.5 1.5 0 0 0 11.5 2.5 H 4 A 1.5 1.5 0 0 0 2.5 4 V 11.5 A 1.5 1.5 0 0 0 4 13 H 4.5"
                                        stroke = "currentColor"
                                        strokeWidth = "1.6"
                                        strokeLinecap = "round"
                                    />
                                </svg>
                            )}
                            <span>{copied ? "Email copied!" : profile.email}</span>
                        </button>

                        <Link to = "/blog" className = {styles.quickLink}>
                            Engineering Blog →
                        </Link>
                    </div>
                </div>

                {/* Directory Grid */}
                <div className = {styles.directoryGrid}>
                    <div className = {styles.identityCol}>
                        <span className = {styles.colTitle}>Engineer</span>
                        <p className = {styles.identityName}>{profile.name}</p>
                        <p className = {styles.identitySummary}>{profile.summary}</p>
                        <span className = {styles.locationMeta}>{profile.location}</span>
                    </div>

                    <div className = {styles.linkCol}>
                        <span className = {styles.colTitle}>Sections</span>
                        <ul className = {styles.colList}>
                            {sectionLinks.map((item, idx) => (
                                <li key = {item.label}>
                                    <Link to = {{ pathname: "/", hash: item.hash }} className = {styles.indexedLink}>
                                        <span className = {styles.linkIdx}>0{idx + 1}</span>
                                        <span>{item.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className = {styles.linkCol}>
                        <span className = {styles.colTitle}>Pages</span>
                        <ul className = {styles.colList}>
                            {pageLinks.map((page) => (
                                <li key = {page.to}>
                                    <Link to = {page.to} className = {styles.colLink}>
                                        {page.label} →
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className = {styles.linkCol}>
                        <span className = {styles.colTitle}>Elsewhere</span>
                        <ul className = {styles.colList}>
                            {socials.map((social) => (
                                <li key = {social.label}>
                                    <a
                                        href = {social.href}
                                        target = "_blank"
                                        rel = "noreferrer"
                                        className = {styles.colLink}
                                    >
                                        {social.label} ↗
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Colophon */}
                <div className = {styles.bottomBar}>
                    <small className = {styles.meta}>© {YEAR} {profile.name} · Systems &amp; Backend Portfolio</small>
                    <BackToTopBtn />
                </div>
            </div>
        </footer>
    )
}
