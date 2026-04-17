// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|


// STYLES ------------------------------------------------------------------------------------------------------------------------------------------|
import '../styles/sections/Process.css'

// PROCESS SECTION -------------------------------------------------------------------------------------------------------------------------------|
function ProcessSection() {
    return (
        <section id = "process" className = "process-section">
            <div className = "section-header">
                <span className = "section-label">Process</span>
                <h2>How I work</h2>
                <p>
                    This section outlines the workflow from idea to launch. It can help visitors understand
                    how you turn concepts into production-ready work.
                </p>
            </div>

            <div className = "process-steps">
                <article className = "process-step">
                    <h3>01. Discover</h3>
                    <p>Understand goals, users, and context before designing solutions that matter.</p>
                </article>
                <article className = "process-step">
                    <h3>02. Design</h3>
                    <p>Create thoughtful layouts, interactions, and prototypes with clear structure.</p>
                </article>
                <article className = "process-step">
                    <h3>03. Deliver</h3>
                    <p>Build fast, accessible experiences and iterate based on feedback and testing.</p>
                </article>
            </div>
        </section>
    )
}

// EXPORTS -----------------------------------------------------------------------------------------------------------------------------------------|
export default ProcessSection
