// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { useState, useEffect } from 'react'
import { motion, MotionConfig } from 'motion/react'
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
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit'
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

// MOTION VARIANTS ---------------------------------------------------------------------------------------------------------------------------------|
const ease = [0.22, 1, 0.36, 1]

const viewport = { once: true, amount: 0.15, margin: '0px 0px -10% 0px' }
const reveal = { initial: 'hidden', whileInView: 'visible', viewport }

const cardVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.65, ease }
    }
}

const listVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } }
}

const subListVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06 } }
}

const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } }
}

const detailVariants = {
    hidden: { opacity: 0, x: 16 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease } }
}

// CONTACT SECTION ---------------------------------------------------------------------------------------------------------------------------------|
export default function ContactSection() {
    const [form, setForm] = useState(INITIAL_FORM)
    const [errors, setErrors] = useState({})
    const [status, setStatus] = useState('idle')
    const localTime = useLocalTime(contactInfo.timeZone)

    const isSending = status === 'sending'
    const isFinished = status === 'success' || status === 'error'
    const fallbackHref = `mailto:${contactInfo.email}?subject=${encodeURIComponent(form.subject.trim())}&body=${encodeURIComponent(form.message.trim())}`

    const handleChange = (event) => {
        const { name, value } = event.target

        setForm((prev) => ({ ...prev, [name]: value }))
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
        if (isFinished) setStatus('idle')
    }

    const handleBlur = (event) => {
        const { name, value } = event.target

        if (value.trim()) setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (isSending) return

        const formElement = event.currentTarget
        const nextErrors = {}

        Object.keys(INITIAL_FORM).forEach((name) => {
            const message = validateField(name, form[name])
            if (message) nextErrors[name] = message
        })

        setErrors(nextErrors)

        const firstInvalid = Object.keys(nextErrors)[0]

        if (firstInvalid) {
            formElement.elements[firstInvalid]?.focus()
            setStatus('idle')
            return
        }

        if (formElement.elements.botcheck.checked) return

        setStatus('sending')

        try {
            const response = await fetch(WEB3FORMS_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({
                    access_key: formConfig.accessKey,
                    from_name: 'Portfolio Contact Form',
                    name: form.name.trim(),
                    email: form.email.trim(),
                    subject: `Portfolio contact: ${form.subject.trim()}`,
                    message: form.message.trim()
                })
            })

            const result = await response.json()

            if (!response.ok || !result.success) throw new Error(result.message)

            setStatus('success')
            setForm(INITIAL_FORM)
        } catch {
            setStatus('error')
        }
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
        <MotionConfig reducedMotion = "user">
            <section id = "contact" className = {styles.section}>
                <div className = {styles.container}>
                    <motion.div
                        className = {styles.card}
                        variants = {cardVariants}
                        {...reveal}
                    >

                        {/* Left: heading + form */}
                        <motion.form
                            className = {styles.formColumn}
                            variants = {listVariants}
                            onSubmit = {handleSubmit}
                            noValidate
                        >

                            <motion.div className = {styles.header} variants = {itemVariants}>
                                <h2 className = {styles.title}>{contactInfo.title}</h2>
                                <p className = {styles.subtitle}>{contactInfo.subtitle}</p>
                            </motion.div>

                            <motion.div className = {styles.fieldRow} variants = {itemVariants}>
                                <div className = {styles.field}>
                                    <FieldLabel name = "name" error = {errors.name} />
                                    <input type = "text" autoComplete = "name" {...getInputProps('name')} />
                                </div>

                                <div className = {styles.field}>
                                    <FieldLabel name = "email" error = {errors.email} />
                                    <input type = "email" autoComplete = "email" {...getInputProps('email')} />
                                </div>
                            </motion.div>

                            <motion.div className = {styles.field} variants = {itemVariants}>
                                <FieldLabel name = "subject" error = {errors.subject} />
                                <input type = "text" {...getInputProps('subject')} />
                            </motion.div>

                            <motion.div className = {`${styles.field} ${styles.messageField}`} variants = {itemVariants}>
                                <FieldLabel name = "message" error = {errors.message}>
                                    <span className = {styles.counter}>{form.message.length} / {maxMessageLength}</span>
                                </FieldLabel>

                                <textarea maxLength = {maxMessageLength} {...getInputProps('message', styles.textarea)} />
                            </motion.div>

                            <input
                                type = "checkbox"
                                name = "botcheck"
                                className = {styles.honeypot}
                                tabIndex = {-1}
                                autoComplete = "off"
                                aria-hidden = "true"
                            />

                            <motion.div className = {styles.formFooter} variants = {itemVariants}>
                                <PrimaryBtn type = "submit" disabled = {isSending}>
                                    {isSending ? formConfig.sendingLabel : formConfig.submitLabel}
                                    <Send size = {14} />
                                </PrimaryBtn>

                                <p
                                    className = {`${styles.feedback} ${isFinished ? styles.feedbackVisible : ''} ${status === 'error' ? styles.feedbackError : ''}`}
                                    role = "status"
                                >
                                    {status === 'error' ? <AlertCircle size = {14} /> : <Check size = {14} />}
                                    <span>
                                        {status === 'error' ? formConfig.errorMessage : formConfig.successMessage}
                                        {status === 'error' && (
                                            <>
                                                {' '}
                                                <a href = {fallbackHref} className = {styles.feedbackLink}>{formConfig.fallbackLabel}</a>
                                            </>
                                        )}
                                    </span>
                                </p>
                            </motion.div>

                        </motion.form>

                        {/* Right: illustration + details + socials */}
                        <motion.aside
                            className = {styles.sideColumn}
                            variants = {listVariants}
                            {...reveal}
                        >

                            <motion.div className = {styles.illustrationWrap} variants = {detailVariants}>
                                <ContactIllustration />
                            </motion.div>

                            <motion.span className = {styles.availability} variants = {itemVariants}>
                                <span className = {styles.pulseDot} />
                                {contactInfo.availability}
                            </motion.span>

                            <motion.div className = {styles.details} variants = {subListVariants}>
                                <motion.a
                                    href = {`mailto:${contactInfo.email}`}
                                    className = {`${styles.detail} ${styles.detailLink}`}
                                    variants = {itemVariants}
                                >
                                    <Mail size = {16} />
                                    <span>{contactInfo.email}</span>
                                </motion.a>

                                <motion.div className = {styles.detail} variants = {itemVariants}>
                                    <MapPin size = {16} />
                                    <span>{contactInfo.location}</span>
                                </motion.div>

                                <motion.div className = {styles.detail} variants = {itemVariants}>
                                    <Clock size = {16} />
                                    <span>Local time: {localTime} {contactInfo.timeZoneLabel}</span>
                                </motion.div>
                            </motion.div>

                            <motion.div className = {styles.socials} variants = {subListVariants}>
                                <motion.div className = {styles.socialLink} variants = {itemVariants}>
                                    <GithubBtn />
                                </motion.div>
                                <motion.div className = {styles.socialLink} variants = {itemVariants}>
                                    <LinkedinBtn />
                                </motion.div>
                                <motion.div className = {styles.socialLink} variants = {itemVariants}>
                                    <XBtn />
                                </motion.div>
                            </motion.div>

                        </motion.aside>

                    </motion.div>
                </div>
            </section>
        </MotionConfig>
    )
}
