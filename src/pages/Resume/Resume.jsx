// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { useState } from "react"
import { Link } from "react-router"
import { motion, useReducedMotion } from "motion/react"

// DATA --------------------------------------------------------------------------------------------------------------------------------------------|
import { resumeData } from "../../data/resume.data.js"
import { profile, socials } from "../../data/profile.data.js"

// UTILS -------------------------------------------------------------------------------------------------------------------------------------------|
import { validateContactForm } from "../../utils/systemsSim.js"
import { copyTextToClipboard } from "../../utils/contentHelpers.js"

// STYLES ------------------------------------------------------------------------------------------------------------------------------------------|
import styles from "./Resume.module.css"

// CONSTANTS ---------------------------------------------------------------------------------------------------------------------------------------|
const WEB3FORMS_ACCESS_KEY = "795b5f51-be95-4fb7-9d9b-e1c06aa969a6"
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit"

const OPPORTUNITY_TYPES = [
    "Systems / Backend Role",
    "Engineering Internship",
    "Project Collaboration",
    "Technical Walkthrough"
]

// RESUME PAGE -------------------------------------------------------------------------------------------------------------------------------------|
export default function Resume() {
    const [copiedEmail, setCopiedEmail] = useState(false)
    const [opportunity, setOpportunity] = useState(OPPORTUNITY_TYPES[0])
    const [form, setForm] = useState({ name: "", email: "", team: "", message: "" })
    const [botcheck, setBotcheck] = useState(false)
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState("")
    const [submittedInfo, setSubmittedInfo] = useState(null)
    const shouldReduceMotion = useReducedMotion()

    const handlePrint = () => {
        window.print()
    }

    const handleCopyEmail = async () => {
        const ok = await copyTextToClipboard(profile.email)
        if (ok) {
            setCopiedEmail(true)
            window.setTimeout(() => setCopiedEmail(false), 2200)
        }
    }

    const handleChange = (field) => (event) => {
        const value = event.target.value
        setForm((prev) => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors((prev) => {
                const next = { ...prev }
                delete next[field]
                return next
            })
        }
        if (submitError) {
            setSubmitError("")
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (isSubmitting) return

        const validation = validateContactForm({ ...form, subject: opportunity })
        if (!validation.valid) {
            setErrors(validation.errors)
            return
        }

        setErrors({})
        setSubmitError("")
        setIsSubmitting(true)

        const cleanName = form.name.trim()
        const cleanEmail = form.email.trim()
        const cleanTeam = form.team.trim()
        const cleanMessage = form.message.trim()

        try {
            const response = await fetch(WEB3FORMS_ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify({
                    access_key: WEB3FORMS_ACCESS_KEY,
                    from_name: "Krexilor Portfolio",
                    subject: `[Portfolio · Resume] ${opportunity}${cleanTeam ? ` — ${cleanTeam}` : ""} — ${cleanName}`,
                    replyto: cleanEmail,
                    source: "Portfolio Resume Page",
                    inquiry_type: opportunity,
                    name: cleanName,
                    team: cleanTeam || "Not specified",
                    email: cleanEmail,
                    message: cleanMessage,
                    botcheck
                })
            })

            const data = await response.json().catch(() => ({}))

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Unable to send inquiry right now.")
            }

            setSubmittedInfo({
                name: cleanName,
                email: cleanEmail,
                team: cleanTeam,
                message: cleanMessage,
                opportunity
            })
            setForm({ name: "", email: "", team: "", message: "" })
        }
        catch (err) {
            setSubmitError(err?.message || "Network error while sending inquiry. Please try again or use direct email.")
        }
        finally {
            setIsSubmitting(false)
        }
    }

    const handleReset = () => {
        setForm({ name: "", email: "", team: "", message: "" })
        setErrors({})
        setSubmitError("")
        setSubmittedInfo(null)
    }

    const mailtoHref = `mailto:${profile.email}?subject=${encodeURIComponent(
        `${opportunity}${form.team ? ` — ${form.team}` : ""}`
    )}&body=${encodeURIComponent(
        `From: ${form.name} (${form.email})\n\n${form.message}`
    )}`

    return (
        <main className = {styles.pageWrapper}>
            <motion.div
                className = {`container ${styles.resumeShell}`}
                initial = {shouldReduceMotion ? false : { opacity: 0, y: 14 }}
                animate = {{ opacity: 1, y: 0 }}
                transition = {{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
                {/* Top Navigation & Document Controls */}
                <div className = {styles.topBar}>
                    <Link to = "/" className = {styles.backLink}>
                        ← Back to Portfolio
                    </Link>

                    <div className = {styles.docControls}>
                        <button
                            type = "button"
                            className = {`${styles.copyBtn} ${copiedEmail ? styles.copyBtnDone : ""}`}
                            onClick = {handleCopyEmail}
                            aria-live = "polite"
                        >
                            {copiedEmail ? (
                                <svg className = {styles.btnIcon} viewBox = "0 0 20 20" fill = "none" aria-hidden = "true">
                                    <path
                                        d = "M4.5 10.5 L8.2 14.2 L15.5 6.5"
                                        stroke = "currentColor"
                                        strokeWidth = "2"
                                        strokeLinecap = "round"
                                        strokeLinejoin = "round"
                                    />
                                </svg>
                            ) : (
                                <svg className = {styles.btnIcon} viewBox = "0 0 20 20" fill = "none" aria-hidden = "true">
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
                            <span>{copiedEmail ? "Email copied!" : profile.email}</span>
                        </button>

                        <button type = "button" className = {styles.printBtn} onClick = {handlePrint}>
                            Print
                        </button>

                        <a
                            href = {resumeData.pdfHref}
                            download = {resumeData.pdfFilename}
                            className = {styles.downloadBtn}
                        >
                            Download PDF
                        </a>
                    </div>
                </div>

                {/* Main Split: Condensed CV Sheet (Left) + Role Inquiry Form (Right) */}
                <div className = {styles.layoutGrid}>
                    {/* Left Column: Clean Condensed CV Sheet */}
                    <article className = {styles.cvSheet} aria-label = "Curriculum Vitae">
                        <header className = {styles.cvHeader}>
                            <span className = "eyebrow">Curriculum Vitae</span>
                            <div className = {styles.cvTitleRow}>
                                <h1 className = {styles.docName}>{profile.name}</h1>
                                <span className = {styles.docRole}>{profile.role}</span>
                            </div>
                            <p className = {styles.docSummary}>{profile.summary}</p>

                            <div className = {styles.profileLinks}>
                                <span>{profile.location}</span>
                                {Array.isArray(socials) && socials.map((social) => (
                                    <span key = {social.label} className = {styles.profileLinkItem}>
                                        <span aria-hidden = "true">·</span>
                                        <a href = {social.href} target = "_blank" rel = "noreferrer">
                                            {social.label} ↗
                                        </a>
                                    </span>
                                ))}
                                {profile.portfolioUrl && (
                                    <span className = {styles.profileLinkItem}>
                                        <span aria-hidden = "true">·</span>
                                        <a href = {profile.portfolioUrl} target = "_blank" rel = "noreferrer">
                                            {profile.portfolioLabel || profile.portfolioUrl} ↗
                                        </a>
                                    </span>
                                )}
                            </div>
                        </header>

                        {/* Projects */}
                        {Array.isArray(resumeData.projects) && resumeData.projects.length > 0 && (
                            <section className = {styles.cvSection}>
                                <h2 className = {styles.sectionHeading}>01 · Engineering Projects</h2>

                                <div className = {styles.entriesList}>
                                    {resumeData.projects.map((project) => (
                                        <div key = {project.name} className = {styles.entry}>
                                            <div className = {styles.entryTop}>
                                                <h3 className = {styles.itemTitle}>{project.name}</h3>
                                                <div className = {styles.entryMeta}>
                                                    <span
                                                        className = {
                                                            project.status === "Completed"
                                                                ? styles.statusCompleted
                                                                : styles.statusPlanned
                                                        }
                                                    >
                                                        {project.status}
                                                    </span>
                                                    {project.liveUrl && (
                                                        <>
                                                            <span aria-hidden = "true">·</span>
                                                            <a
                                                                href = {project.liveUrl}
                                                                target = "_blank"
                                                                rel = "noreferrer"
                                                                className = {styles.liveLink}
                                                            >
                                                                Live ↗
                                                            </a>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {project.stack && <p className = {styles.itemStack}>{project.stack}</p>}

                                            {Array.isArray(project.bullets) && project.bullets.length > 0 && (
                                                <ul className = {styles.bulletList}>
                                                    {project.bullets.map((bullet, bIdx) => (
                                                        <li key = {bIdx} className = {styles.bulletItem}>
                                                            {bullet}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Skills */}
                        {Array.isArray(resumeData.skills) && resumeData.skills.length > 0 && (
                            <section className = {styles.cvSection}>
                                <h2 className = {styles.sectionHeading}>02 · Technical Stack</h2>

                                <dl className = {`${styles.skillMatrix} ${resumeData.skills.length === 1 ? styles.skillMatrixSingle : ""}`}>
                                    {resumeData.skills.map((row) => (
                                        <div key = {row.category} className = {styles.skillRow}>
                                            <dt className = {styles.skillCat}>{row.category}</dt>
                                            <dd className = {styles.skillVal}>{(row.items || []).join(" · ")}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </section>
                        )}

                        {/* Education & Certificates */}
                        {((Array.isArray(resumeData.education) && resumeData.education.length > 0) ||
                            (Array.isArray(resumeData.certificates) && resumeData.certificates.length > 0)) && (
                            <section className = {styles.cvSection}>
                                <h2 className = {styles.sectionHeading}>03 · Education &amp; Credentials</h2>

                                <div className = {styles.credList}>
                                    {(resumeData.education || []).map((edu) => (
                                        <div key = {edu.institution} className = {styles.credRow}>
                                            <div>
                                                <h3 className = {styles.credTitle}>{edu.institution}</h3>
                                                <p className = {styles.credSub}>
                                                    {edu.degree}
                                                    {Array.isArray(edu.details) && edu.details.length > 0
                                                        ? ` — ${edu.details.join(" · ")}`
                                                        : ""}
                                                </p>
                                            </div>
                                            <span className = {styles.credPeriod}>{edu.period}</span>
                                        </div>
                                    ))}

                                    {(resumeData.certificates || []).map((cert) => (
                                        <div key = {cert.title} className = {styles.credRow}>
                                            <div>
                                                <h3 className = {styles.credTitle}>{cert.title}</h3>
                                                <p className = {styles.credSub}>{cert.issuer}</p>
                                            </div>
                                            <span className = {styles.credPeriod}>{cert.year}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </article>

                    {/* Right Column: Hiring & Walkthrough Inquiry Form */}
                    <aside className = {styles.formPanel} aria-label = "Hiring inquiry form">
                        <div className = {styles.formHeader}>
                            <span className = "eyebrow">Direct Inquiry</span>
                            <h2 className = {styles.formTitle}>Hiring or want a deeper technical walkthrough?</h2>
                            <p className = {styles.formSubtitle}>
                                Share a role description, internship details, or system problem you want to discuss.
                            </p>
                        </div>

                        {submittedInfo ? (
                            <div className = {styles.successState} role = "status">
                                <span className = {styles.successEyebrow}>Inquiry Sent</span>
                                <h3 className = {styles.successTitle}>Thanks, {submittedInfo.name}.</h3>
                                <p className = {styles.successText}>
                                    Your note regarding <strong>{submittedInfo.opportunity}</strong> has been delivered directly to{" "}
                                    <strong>{profile.email}</strong>. Feel free to also grab the PDF resume above.
                                </p>
                                <div className = {styles.successActions}>
                                    <button type = "button" className = {styles.resetBtn} onClick = {handleReset}>
                                        Send Another Inquiry
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <form className = {styles.form} onSubmit = {handleSubmit} noValidate>
                                <input
                                    type = "checkbox"
                                    name = "botcheck"
                                    checked = {botcheck}
                                    onChange = {(event) => setBotcheck(event.target.checked)}
                                    className = {styles.honeypot}
                                    tabIndex = {-1}
                                    autoComplete = "off"
                                    aria-hidden = "true"
                                />
                                <div className = {styles.field}>
                                    <span className = {styles.fieldLabel}>Inquiry Type</span>
                                    <div className = {styles.typeGrid}>
                                        {OPPORTUNITY_TYPES.map((type) => {
                                            const active = opportunity === type
                                            return (
                                                <button
                                                    key = {type}
                                                    type = "button"
                                                    className = {`${styles.typeBtn} ${active ? styles.typeBtnActive : ""}`}
                                                    onClick = {() => setOpportunity(type)}
                                                >
                                                    {type}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

                                <div className = {styles.fieldRow}>
                                    <div className = {styles.field}>
                                        <label htmlFor = "resume-name" className = {styles.fieldLabel}>
                                            Your Name
                                        </label>
                                        <input
                                            id = "resume-name"
                                            type = "text"
                                            value = {form.name}
                                            onChange = {handleChange("name")}
                                            placeholder = "Hiring manager / engineer"
                                            className = {`${styles.input} ${errors.name ? styles.inputError : ""}`}
                                        />
                                        {errors.name && <span className = {styles.errorText}>{errors.name}</span>}
                                    </div>

                                    <div className = {styles.field}>
                                        <label htmlFor = "resume-team" className = {styles.fieldLabel}>
                                            Company / Team (optional)
                                        </label>
                                        <input
                                            id = "resume-team"
                                            type = "text"
                                            value = {form.team}
                                            onChange = {handleChange("team")}
                                            placeholder = "Core Infrastructure"
                                            className = {styles.input}
                                        />
                                    </div>
                                </div>

                                <div className = {styles.field}>
                                    <label htmlFor = "resume-email" className = {styles.fieldLabel}>
                                        Work Email
                                    </label>
                                    <input
                                        id = "resume-email"
                                        type = "email"
                                        value = {form.email}
                                        onChange = {handleChange("email")}
                                        placeholder = "you@company.com"
                                        className = {`${styles.input} ${errors.email ? styles.inputError : ""}`}
                                    />
                                    {errors.email && <span className = {styles.errorText}>{errors.email}</span>}
                                </div>

                                <div className = {styles.field}>
                                    <label htmlFor = "resume-message" className = {styles.fieldLabel}>
                                        Role Details or Message
                                    </label>
                                    <textarea
                                        id = "resume-message"
                                        rows = "4"
                                        value = {form.message}
                                        onChange = {handleChange("message")}
                                        placeholder = "Tell me about the stack, team, or next steps..."
                                        className = {`${styles.textarea} ${errors.message ? styles.inputError : ""}`}
                                    />
                                    {errors.message && <span className = {styles.errorText}>{errors.message}</span>}
                                </div>

                                <button type = "submit" className = {styles.submitBtn} disabled = {isSubmitting}>
                                    {isSubmitting ? "Sending..." : "Send Inquiry"}
                                </button>

                                {submitError && (
                                    <div className = {styles.errorBox} role = "alert">
                                        <span>{submitError}</span>
                                        <a href = {mailtoHref} className = {styles.mailtoLink}>
                                            Send via Mail Client ↗
                                        </a>
                                    </div>
                                )}
                            </form>
                        )}
                    </aside>
                </div>
            </motion.div>
        </main>
    )
}
