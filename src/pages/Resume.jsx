// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import React from "react";
import { useNavigate } from 'react-router-dom'

// STYLES ------------------------------------------------------------------------------------------------------------------------------------------|
import '../styles/pages/Resume.css'

// RESUME PAGE -------------------------------------------------------------------------------------------------------------------------------------|
export default function Resume() {
  const navigate = useNavigate()

  return (
    <main className = "page-container resume-page">
      <button type="button" className="back-button" onClick={() => navigate('/')}>Go back to portfolio</button>
      <section className = "page-hero">
        <span className = "page-label">Resume</span>
        <h1>Experience, skills, and work highlights</h1>
        <p>
          This resume placeholder showcases a clean overview of your background, key contributions,
          and the value you bring to clients or teams.
        </p>
      </section>

      <section className = "resume-summary">
        <div className = "resume-block">
          <h2>Experience</h2>
          <ul>
            <li><strong>Front-end Developer</strong> — Built user experiences with modern web technologies and performance in mind.</li>
            <li><strong>Product Designer</strong> — Designed interface flows, wireframes, and polished visual systems.</li>
          </ul>
        </div>
        <div className = "resume-block">
          <h2>Skills</h2>
          <p>React, JavaScript, CSS, responsive design, accessibility, animation, UX/UI, performance optimization.</p>
        </div>
      </section>
    </main>
  );
}
