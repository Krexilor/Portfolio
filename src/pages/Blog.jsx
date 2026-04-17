// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import React from "react";
import { useNavigate } from 'react-router-dom'

// STYLES ------------------------------------------------------------------------------------------------------------------------------------------|
import '../styles/pages/Blog.css'

// BLOG PAGE ---------------------------------------------------------------------------------------------------------------------------------------|
export default function Blog() {
  const navigate = useNavigate()

  return (
    <main className = "page-container blog-page">
      <button type="button" className="back-button" onClick={() => navigate('/')}>Go back to portfolio</button>
      <section className = "page-hero">
        <span className = "page-label">Blog</span>
        <h1>Latest posts and updates</h1>
        <p>
          This blog placeholder is ready for your articles. Use it to share project updates,
          insights, and technical stories with your audience.
        </p>
      </section>

      <section className = "blog-list">
        <article className = "blog-card">
          <h2>Making a better portfolio experience</h2>
          <p>Ideas for creating a portfolio that feels polished, professional, and easy to navigate.</p>
          <span>3 min read</span>
        </article>
        <article className = "blog-card">
          <h2>Fast interactions with modern web layouts</h2>
          <p>How to balance animation, accessibility, and performance when designing interfaces.</p>
          <span>4 min read</span>
        </article>
      </section>
    </main>
  );
}
