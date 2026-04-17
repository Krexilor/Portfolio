// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|


// STYLES ------------------------------------------------------------------------------------------------------------------------------------------|
import '../styles/sections/Work.css'

// WORK SECTION ------------------------------------------------------------------------------------------------------------------------------------|
function WorkSection() {
    return (
        <section id = "work" className = "work-section">
            <div className = "section-header">
                <span className = "section-label">Work</span>
                <h2>Featured projects</h2>
                <p>
                    Preview the kind of projects you can show here: performance-first applications,
                    polished UIs, and practical tools for real users.
                </p>
            </div>

            <div className = "project-list">
                <article className = "project-card">
                    <h3>Project Alpha</h3>
                    <p>A responsive web interface with polished transitions and strong visual hierarchy.</p>
                </article>
                <article className = "project-card">
                    <h3>Project Beta</h3>
                    <p>A content-driven page with clear structure, fast loading, and seamless navigation.</p>
                </article>
                <article className = "project-card">
                    <h3>Project Gamma</h3>
                    <p>A custom interaction system built for clarity and accessibility across devices.</p>
                </article>
            </div>
        </section>
    )
}

// EXPORTS -----------------------------------------------------------------------------------------------------------------------------------------|
export default WorkSection
