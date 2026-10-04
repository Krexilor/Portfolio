// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { useState, useEffect } from 'react'
import { Mail, MapPin, Clock, Send, Check, AlertCircle } from 'lucide-react'

// STYLES ------------------------------------------------------------------------------------------------------------------------------------------|
import styles from './Contact.module.css'

// COMPONENTS --------------------------------------------------------------------------------------------------------------------------------------|
import { PrimaryBtn, GithubBtn, LinkedinBtn, XBtn } from '../../components/Common/Button/Button.jsx'

// DATA --------------------------------------------------------------------------------------------------------------------------------------------|
import { contactInfo, formConfig } from '../../data/contact.data.js'

// CONSTANTS ---------------------------------------------------------------------------------------------------------------------------------------|
const INITIAL_FORM = { name: '', email: '', subject: '', message: '' }
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const INVALID_EMAIL_ERROR = 'Enter a valid email address.'
const { maxMessageLength } = formConfig

const fields = {
    name: { label: 'Name', placeholder: 'Your name', error: 'Please enter your name.' },
    email: { label: 'Email', placeholder: 'you@example.com', error: 'Please enter your email.' },
    subject: { label: 'Subject', placeholder: 'What\'s this about?', error: 'Please add a subject.' },
    message: { label: 'Message', placeholder: 'Type something if you want...', error: 'Please write a message.' }
}

// VALIDATION --------------------------------------------------------------------------------------------------------------------------------------|
function validateField(name, value) {
    const trimmed = value.trim()

    if (!trimmed) return fields[name].error
    if (name === 'email' && !EMAIL_PATTERN.test(trimmed)) return INVALID_EMAIL_ERROR

    return ''
}

// LOCAL TIME HELPERS ------------------------------------------------------------------------------------------------------------------------------|
const formatTime = (timeZone) => new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone
}).format(new Date())

function useLocalTime(timeZone) {
    const [time, setTime] = useState(() => formatTime(timeZone))

    useEffect(() => {
        const id = setInterval(() => setTime(formatTime(timeZone)), 30000)
        return () => clearInterval(id)
    }, [timeZone])

    return time
}

// FIELD LABEL ROW (LABEL + INLINE ERROR) ----------------------------------------------------------------------------------------------------------|
function FieldLabel({ name, error, children }) {
    return (
        <div className = {styles.labelRow}>
            <label htmlFor = {`contact-${name}`} className = {styles.label}>{fields[name].label}</label>

            {error ? (
                <span id = {`contact-${name}-error`} className = {styles.error} role = "alert">
                    <AlertCircle size = {12} />
                    {error}
                </span>
            ) : children}
        </div>
    )
}

// ILLUSTRATION  -----------------------------------------------------------------------------------------------------------------------------------|
function ContactIllustration() {
    return (
        <svg
            className = {styles.illustration}
            viewBox = "0 0 320 220"
            xmlns = "http://www.w3.org/2000/svg"
            aria-hidden = "true"
            focusable = "false"
        >
            {/* Background rings */}
            <circle cx = "160" cy = "110" r = "104" className = {styles.illOrbit} />
            <circle cx = "160" cy = "110" r = "84" className = {styles.illCircle} />

            {/* Letter */}
            <rect x = "124" y = "62" width = "72" height = "76" rx = "5" className = {styles.illPaper} />
            <line x1 = "136" y1 = "78" x2 = "184" y2 = "78" className = {styles.illLine} />
            <line x1 = "136" y1 = "90" x2 = "176" y2 = "90" className = {styles.illLine} />
            <line x1 = "136" y1 = "102" x2 = "168" y2 = "102" className = {styles.illLine} />

            {/* Envelope */}
            <rect x = "104" y = "112" width = "112" height = "70" rx = "8" className = {styles.illSurface} />
            <path d = "M108 118 L160 154 L212 118" className = {styles.illOutline} />

            {/* Chat bubble */}
            <g className = {styles.floatA}>
                <rect x = "40" y = "52" width = "56" height = "36" rx = "10" className = {styles.illSurface} />
                <circle cx = "56" cy = "70" r = "3" className = {styles.illDot} />
                <circle cx = "68" cy = "70" r = "3" className = {styles.illDot} />
                <circle cx = "80" cy = "70" r = "3" className = {styles.illDot} />
            </g>

            {/* Paper plane */}
            <g className = {styles.floatB}>
                <path d = "M238 74 L288 50 L268 100 L257 80 Z" className = {styles.illAccent} />
                <path d = "M257 80 L288 50" className = {styles.illAccent} />
            </g>

            {/* Decorations */}
            <circle cx = "48" cy = "148" r = "5" className = {styles.illOutline} />
            <circle cx = "276" cy = "148" r = "4" className = {styles.illDotAccent} />
            <circle cx = "232" cy = "30" r = "3" className = {styles.illDot} />
            <circle cx = "108" cy = "30" r = "3" className = {styles.illDotAccent} />
            <path d = "M272 120 v12 M266 126 h12" className = {styles.illOutline} />
            <path d = "M64 124 v10 M59 129 h10" className = {styles.illOutline} />
        </svg>
    )
}

// CONTACT SECTION ---------------------------------------------------------------------------------------------------------------------------------|
export default function ContactSection() {
    const [form, setForm] = useState(INITIAL_FORM)
    const [errors, setErrors] = useState({})
    const [isSent, setIsSent] = useState(false)
    const localTime = useLocalTime(contactInfo.timeZone)

    const handleChange = (event) => {
        const { name, value } = event.target

        setForm((prev) => ({ ...prev, [name]: value }))
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
        if (isSent) setIsSent(false)
    }

    const handleBlur = (event) => {
        const { name, value } = event.target

        if (value.trim()) setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        const nextErrors = {}

        Object.keys(INITIAL_FORM).forEach((name) => {
            const message = validateField(name, form[name])
            if (message) nextErrors[name] = message
        })

        setErrors(nextErrors)

        const firstInvalid = Object.keys(nextErrors)[0]

        if (firstInvalid) {
            event.currentTarget.elements[firstInvalid]?.focus()
            setIsSent(false)
            return
        }

        // UI ONLY FOR NOW - NOT CONNECTED TO ANY EMAIL SERVICE
        setIsSent(true)
        setForm(INITIAL_FORM)
    }

    // Shared input props
    const getInputProps = (name, extraClass = '') => ({
        id: `contact-${name}`,
        name,
        className: `${styles.input} ${errors[name] ? styles.inputError : ''} ${extraClass}`,
        placeholder: fields[name].placeholder,
        value: form[name],
        onChange: handleChange,
        onBlur: handleBlur,
        'aria-required': true,
        'aria-invalid': Boolean(errors[name]),
        'aria-describedby': errors[name] ? `contact-${name}-error` : undefined
    })

    return (
        <section id = "contact" className = {styles.section}>
            <div className = {styles.container}>

                <div className = {styles.card}>

                    {/* Left: heading + form */}
                    <form className = {styles.formColumn} onSubmit = {handleSubmit} noValidate>

                        <div className = {styles.header}>
                            <h2 className = {styles.title}>{contactInfo.title}</h2>
                            <p className = {styles.subtitle}>{contactInfo.subtitle}</p>
                        </div>

                        <div className = {styles.fieldRow}>
                            <div className = {styles.field}>
                                <FieldLabel name = "name" error = {errors.name} />
                                <input type = "text" autoComplete = "name" {...getInputProps('name')} />
                            </div>

                            <div className = {styles.field}>
                                <FieldLabel name = "email" error = {errors.email} />
                                <input type = "email" autoComplete = "email" {...getInputProps('email')} />
                            </div>
                        </div>

                        <div className = {styles.field}>
                            <FieldLabel name = "subject" error = {errors.subject} />
                            <input type = "text" {...getInputProps('subject')} />
                        </div>

                        <div className = {`${styles.field} ${styles.messageField}`}>
                            <FieldLabel name = "message" error = {errors.message}>
                                <span className = {styles.counter}>{form.message.length} / {maxMessageLength}</span>
                            </FieldLabel>

                            <textarea maxLength = {maxMessageLength} {...getInputProps('message', styles.textarea)} />
                        </div>

                        <div className = {styles.formFooter}>
                            <PrimaryBtn type = "submit">
                                {formConfig.submitLabel}
                                <Send size = {14} />
                            </PrimaryBtn>

                            <p className = {`${styles.feedback} ${isSent ? styles.feedbackVisible : ''}`} role = "status">
                                <Check size = {14} />
                                {formConfig.successMessage}
                            </p>
                        </div>

                    </form>

                    {/* Right: illustration + details + socials */}
                    <aside className = {styles.sideColumn}>

                        <div className = {styles.illustrationWrap}>
                            <ContactIllustration />
                        </div>

                        <span className = {styles.availability}>
                            <span className = {styles.pulseDot} />
                            {contactInfo.availability}
                        </span>

                        <div className = {styles.details}>
                            <a href = {`mailto:${contactInfo.email}`} className = {`${styles.detail} ${styles.detailLink}`}>
                                <Mail size = {16} />
                                <span>{contactInfo.email}</span>
                            </a>

                            <div className = {styles.detail}>
                                <MapPin size = {16} />
                                <span>{contactInfo.location}</span>
                            </div>

                            <div className = {styles.detail}>
                                <Clock size = {16} />
                                <span>Local time: {localTime} {contactInfo.timeZoneLabel}</span>
                            </div>
                        </div>

                        <div className = {styles.socials}>
                            <GithubBtn className = {styles.socialLink} />
                            <LinkedinBtn className = {styles.socialLink} />
                            <XBtn className = {styles.socialLink} />
                        </div>

                    </aside>

                </div>

            </div>
        </section>
    )
}
