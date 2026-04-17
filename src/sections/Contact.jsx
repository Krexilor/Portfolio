// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|


// STYLES ------------------------------------------------------------------------------------------------------------------------------------------|
import '../styles/sections/Contact.css'

// CONTACT SECTION ---------------------------------------------------------------------------------------------------------------------------------|
function ContactSection() {
    return (
        <section id = "contact" className = "contact-section">
            <div className = "section-header">
                <span className = "section-label">Contact</span>
                <h2>Let&apos;s build something together</h2>
                <p>
                    Have a project idea or want to collaborate? Send a quick message and I&apos;ll
                    get back to you soon.
                </p>
            </div>

            <div className = "contact-grid">
                <div className = "contact-card">
                    <h3>Email</h3>
                    <p>hello@example.com</p>
                </div>
                <div className = "contact-card">
                    <h3>Location</h3>
                    <p>Remote / Worldwide</p>
                </div>
                <div className = "contact-card">
                    <h3>Availability</h3>
                    <p>Open for new work and collaborations.</p>
                </div>
            </div>
        </section>
    )
}

// EXPORTS -----------------------------------------------------------------------------------------------------------------------------------------|
export default ContactSection
