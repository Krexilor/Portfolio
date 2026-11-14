// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { useState } from "react"
import { Link } from "react-router"

// COMPONENTS --------------------------------------------------------------------------------------------------------------------------------------|
import Reveal from "../../components/Common/Reveal/Reveal.jsx"

// DATA --------------------------------------------------------------------------------------------------------------------------------------------|
import { profile, socials } from "../../data/profile.data.js"

// UTILS -------------------------------------------------------------------------------------------------------------------------------------------|
import { validateContactForm } from "../../utils/systemsSim.js"
import { copyTextToClipboard } from "../../utils/contentHelpers.js"

// STYLES ------------------------------------------------------------------------------------------------------------------------------------------|
import styles from "./Contact.module.css"

// CONSTANTS ---------------------------------------------------------------------------------------------------------------------------------------|
const WEB3FORMS_ACCESS_KEY = "795b5f51-be95-4fb7-9d9b-e1c06aa969a6"
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit"

const USEFUL_LINKS = [
    ...socials.map((item) => ({ ...item, external: true })),
    { label: "Engineering Blog", handle: "/blog", to: "/blog", external: false },
    { label: "Curriculum Vitae", handle: "/resume", to: "/resume", external: false }
]

// CONTACT SECTION ---------------------------------------------------------------------------------------------------------------------------------|
export default function Contact() {
    const [formValues, setFormValues] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    })
    const [botcheck, setBotcheck] = useState(false)
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState("")
    const [submitted, setSubmitted] = useState(false)
    const [copied, setCopied] = useState(false)

    const handleChange = (field) => (event) => {
        const value = event.target.value
        setFormValues((prev) => ({ ...prev, [field]: value }))
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

    const handleCopyEmail = async () => {
        const ok = await copyTextToClipboard(profile.email)
        if (ok) {
            setCopied(true)
            window.setTimeout(() => setCopied(false), 2400)
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (isSubmitting) return

        const result = validateContactForm(formValues)

        if (!result.valid) {
            setErrors(result.errors)
            setSubmitted(false)
            return
        }

        setErrors({})
        setSubmitError("")
        setIsSubmitting(true)

        const cleanName = formValues.name.trim()
        const cleanEmail = formValues.email.trim()
        const cleanTopic = formValues.subject.trim()
        const cleanMessage = formValues.message.trim()

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
                    subject: `[Portfolio] ${cleanTopic} — ${cleanName}`,
                    replyto: cleanEmail,
                    source: "Portfolio Contact Form",
                    name: cleanName,
                    email: cleanEmail,
                    topic: cleanTopic,
                    message: cleanMessage,
                    botcheck
                })
            })

            const data = await response.json().catch(() => ({}))

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Unable to send message right now.")
            }

            setSubmitted(true)
            setFormValues({ name: "", email: "", subject: "", message: "" })
        }
        catch (err) {
            setSubmitted(false)
            setSubmitError(err?.message || "Network error while sending message. Please try again or use direct email.")
        }
        finally {
            setIsSubmitting(false)
        }
    }

    const mailtoHref = `mailto:${profile.email}?subject=${encodeURIComponent(
        formValues.subject || "Portfolio Inquiry"
    )}&body=${encodeURIComponent(
        `From: ${formValues.name} (${formValues.email})\n\n${formValues.message}`
    )}`

    return (
        <section id = "contact" className = {`section ${styles.sectionContainer}`}>
            <div className = "container">
                <div className = {styles.splitLayout}>
                    {/* Left Editorial Info & Direct Links */}
                    <Reveal className = {styles.infoColumn}>
                        <div className = {styles.headerGroup}>
                            <span className = "eyebrow">Chapter 05 · Contact</span>
                            <h2 className = {styles.heading}>Let's build resilient systems together.</h2>
                            <p className = {styles.subtitle}>
                                Open to systems engineering, backend infrastructure, and C++ or Python internships and collaborations.
                            </p>
                            <p className = {styles.availability}>
                                Pursuing BCA (2025–2028) · Remote-ready for backend &amp; systems teams.
                            </p>
                        </div>

                        {/* Interactive Email Copy Action */}
                        <div className = {styles.emailBlock}>
                            <span className = {styles.blockLabel}>Click to copy direct email</span>
                            <button
                                type = "button"
                                className = {`${styles.emailCopyBtn} ${copied ? styles.emailCopyBtnDone : ""}`}
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
                                <span className = {styles.emailText}>
                                    {copied ? "Email copied!" : profile.email}
                                </span>
                            </button>
                        </div>

                        {/* Useful Links */}
                        <div className = {styles.linksSection}>
                            <span className = {styles.blockLabel}>Useful Links</span>
                            <ul className = {styles.linksList}>
                                {USEFUL_LINKS.map((item) => (
                                    <li key = {item.label} className = {styles.linkRow}>
                                        {item.external ? (
                                            <a
                                                href = {item.href}
                                                target = "_blank"
                                                rel = "noreferrer"
                                                className = {styles.linkAnchor}
                                            >
                                                <span className = {styles.linkTitle}>{item.label}</span>
                                                <span className = {styles.linkHandle}>{item.handle} ↗</span>
                                            </a>
                                        ) : (
                                            <Link to = {item.to} className = {styles.linkAnchor}>
                                                <span className = {styles.linkTitle}>{item.label}</span>
                                                <span className = {styles.linkHandle}>{item.handle} →</span>
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Reveal>

                    {/* Right Message Composer */}
                    <Reveal className = {styles.formColumn} delay = {0.08}>
                        <form className = {styles.formCard} onSubmit = {handleSubmit} noValidate>
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

                            <div className = {styles.formHeader}>
                                <h3 className = {styles.formTitle}>Send a Direct Inquiry</h3>
                                <p className = {styles.formHint}>Messages are delivered directly to my inbox.</p>
                            </div>

                            <div className = {styles.fieldRow}>
                                <div className = {styles.field}>
                                    <label htmlFor = "contact-name" className = {styles.label}>
                                        Your Name
                                    </label>
                                    <input
                                        id = "contact-name"
                                        name = "name"
                                        type = "text"
                                        value = {formValues.name}
                                        onChange = {handleChange("name")}
                                        placeholder = "Ada Lovelace"
                                        className = {styles.input}
                                        aria-invalid = {Boolean(errors.name)}
                                    />
                                    {errors.name && <span className = {styles.errorText}>{errors.name}</span>}
                                </div>

                                <div className = {styles.field}>
                                    <label htmlFor = "contact-email" className = {styles.label}>
                                        Email Address
                                    </label>
                                    <input
                                        id = "contact-email"
                                        name = "email"
                                        type = "email"
                                        value = {formValues.email}
                                        onChange = {handleChange("email")}
                                        placeholder = "you@domain.com"
                                        className = {styles.input}
                                        aria-invalid = {Boolean(errors.email)}
                                    />
                                    {errors.email && <span className = {styles.errorText}>{errors.email}</span>}
                                </div>
                            </div>

                            <div className = {styles.field}>
                                <label htmlFor = "contact-subject" className = {styles.label}>
                                    Topic
                                </label>
                                <input
                                    id = "contact-subject"
                                    name = "subject"
                                    type = "text"
                                    value = {formValues.subject}
                                    onChange = {handleChange("subject")}
                                    placeholder = "Systems Engineering Opportunity"
                                    className = {styles.input}
                                    aria-invalid = {Boolean(errors.subject)}
                                />
                                {errors.subject && <span className = {styles.errorText}>{errors.subject}</span>}
                            </div>

                            <div className = {styles.field}>
                                <label htmlFor = "contact-message" className = {styles.label}>
                                    Message
                                </label>
                                <textarea
                                    id = "contact-message"
                                    name = "message"
                                    rows = "5"
                                    value = {formValues.message}
                                    onChange = {handleChange("message")}
                                    placeholder = "Share a bit about the system, team, or problem you are working on..."
                                    className = {styles.textarea}
                                    aria-invalid = {Boolean(errors.message)}
                                />
                                {errors.message && <span className = {styles.errorText}>{errors.message}</span>}
                            </div>

                            <div className = {styles.formFooter}>
                                <button
                                    type = "submit"
                                    className = {styles.submitBtn}
                                    disabled = {isSubmitting}
                                >
                                    {isSubmitting ? "Sending..." : "Send Message"}
                                </button>

                                {submitted && (
                                    <div className = {styles.successBox} role = "status">
                                        <span>Message sent! I will get back to you soon.</span>
                                        <button
                                            type = "button"
                                            className = {styles.resetLink}
                                            onClick = {() => setSubmitted(false)}
                                        >
                                            Dismiss
                                        </button>
                                    </div>
                                )}

                                {submitError && (
                                    <div className = {styles.errorBox} role = "alert">
                                        <span>{submitError}</span>
                                        <a href = {mailtoHref} className = {styles.mailtoLink}>
                                            Send via Mail Client ↗
                                        </a>
                                    </div>
                                )}
                            </div>
                        </form>
                    </Reveal>
                </div>
            </div>
        </section>
    )
}
