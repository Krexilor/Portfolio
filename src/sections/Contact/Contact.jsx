// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { Mail, MapPin, Send } from 'lucide-react'

// STYLES ------------------------------------------------------------------------------------------------------------------------------------------|
import styles from './Contact.module.css'

// COMPONENTS --------------------------------------------------------------------------------------------------------------------------------------|
import { PrimaryBtn, GithubBtn, LinkedinBtn, XBtn } from '../../components/Common/Button/Button.jsx'

// DATA --------------------------------------------------------------------------------------------------------------------------------------------|
import { contactInfo, formConfig } from '../../data/contact.data.js'

// CONTACT SECTION ---------------------------------------------------------------------------------------------------------------------------------|
export default function ContactSection() {
    const { fields } = formConfig

    return (
        <section id = "contact" className = {styles.section}>
            <div className = {styles.container}>

                <div className = {styles.card}>

                    {/* Header */}
                    <div className = {styles.header}>
                        <h2 className = {styles.title}>{contactInfo.title}</h2>
                        <p className = {styles.subtitle}>{contactInfo.subtitle}</p>
                    </div>

                    <div className = {styles.panels}>

                        {/* Info panel */}
                        <div className = {`${styles.panel} ${styles.infoPanel}`}>

                            <div className = {styles.infoList}>
                                <div className = {styles.infoRow}>
                                    <span className = {styles.infoIcon}><Mail size = {16} /></span>
                                    <div className = {styles.infoText}>
                                        <span className = {styles.infoLabel}>Email</span>
                                        <a href = {`mailto:${contactInfo.email}`} className = {styles.infoValue}>{contactInfo.email}</a>
                                    </div>
                                </div>

                                <div className = {styles.infoRow}>
                                    <span className = {styles.infoIcon}><MapPin size = {16} /></span>
                                    <div className = {styles.infoText}>
                                        <span className = {styles.infoLabel}>Location</span>
                                        <span className = {styles.infoValue}>{contactInfo.location}</span>
                                    </div>
                                </div>
                            </div>

                            <div className = {styles.availability}>
                                <span className = {styles.pulseDot} />
                                <span className = {styles.availabilityText}>{contactInfo.availability}</span>
                            </div>

                            <div className = {styles.socials}>
                                <GithubBtn className = {styles.socialLink} />
                                <LinkedinBtn className = {styles.socialLink} />
                                <XBtn className = {styles.socialLink} />
                            </div>

                        </div>

                        {/* Form panel (visual placeholder only) */}
                        <div className = {`${styles.panel} ${styles.formPanel}`}>

                            <div className = {styles.formPreview} aria-hidden = "true">
                                <div className = {styles.fieldRow}>
                                    <div className = {styles.field}>
                                        <span className = {styles.label}>{fields.name.label}</span>
                                        <div className = {styles.skeleton} />
                                    </div>

                                    <div className = {styles.field}>
                                        <span className = {styles.label}>{fields.email.label}</span>
                                        <div className = {styles.skeleton} />
                                    </div>
                                </div>

                                <div className = {styles.field}>
                                    <span className = {styles.label}>{fields.subject.label}</span>
                                    <div className = {styles.skeleton} />
                                </div>

                                <div className = {`${styles.field} ${styles.messageField}`}>
                                    <span className = {styles.label}>{fields.message.label}</span>
                                    <div className = {`${styles.skeleton} ${styles.skeletonTall}`} />
                                </div>
                            </div>

                            <div className = {styles.formFooter}>
                                <span className = {styles.note}>Contact form coming soon</span>

                                <PrimaryBtn disabled>
                                    {formConfig.submitLabel}
                                    <Send size = {14} />
                                </PrimaryBtn>
                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </section>
    )
}
