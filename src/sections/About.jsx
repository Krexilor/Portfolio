// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|


// STYLES ------------------------------------------------------------------------------------------------------------------------------------------|
import '../styles/sections/About.css'

// ABOUT SECTION -----------------------------------------------------------------------------------------------------------------------------------|
function AboutSection() {
    return (
        <section id = "about" className = "about-section">
            <div className = "section-header">
                <span className = "section-label">About</span>
                <h2>Who I am</h2>
                <p>
                    I create polished digital products with attention to detail, readability,
                    and performance. This section can describe your background, strengths,
                    and what makes your work stand out.
                </p>
            </div>

            <div className = "about-highlights">
                <article>
                    <h3>Experience</h3>
                    <p>Professional development, product design, and collaboration across modern teams.</p>
                </article>
                <article>
                    <h3>Focus</h3>
                    <p>Clean interfaces, fast interactions, and accessible user journeys for web apps.</p>
                </article>
                <article>
                    <h3>Approach</h3>
                    <p>Research first, prototype fast, and deliver quality with consistent feedback.
                    </p>
                </article>
            </div>
        </section>
    )
}

// EXPORTS -----------------------------------------------------------------------------------------------------------------------------------------|
export default AboutSection
