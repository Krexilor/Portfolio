// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { useState, useEffect } from 'react'
import { Star, GitFork, ExternalLink } from 'lucide-react'

// STYLES ------------------------------------------------------------------------------------------------------------------------------------------|
import styles from './Projects.module.css'

// ASSETS ------------------------------------------------------------------------------------------------------------------------------------------|
import DefaultImage from '../../assets/Images/BrokenImage.png'

import DepVizThumbnail from '../../assets/Thumbnails/DepViz.png'

// COMPONENTS --------------------------------------------------------------------------------------------------------------------------------------|
import ScrollFade from '../../components/Common/Animations/ScrollFade.jsx'

// GITHUB CONFIG -----------------------------------------------------------------------------------------------------------------------------------|
const GITHUB_USERNAME = 'Krexilor'

const ALLOWED_REPOS = ['DepViz', 'ForgeLit']

const PROJECT_IMAGES = {
    DepViz: DepVizThumbnail
}

// PROJECTS SECTION --------------------------------------------------------------------------------------------------------------------------------|
export default function ProjectsSection() {
    const [projects, setProjects] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchRepos() {
            try {
                const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`)
                const data = await response.json()

                const filtered = data.filter((repo) => ALLOWED_REPOS.includes(repo.name))

                const withLanguages = await Promise.all(
                    filtered.map(async (repo) => {
                        let languages = []

                        try {
                            const langResponse = await fetch(repo.languages_url)
                            const langData = await langResponse.json()
                            languages = Object.keys(langData)
                        } catch {
                            languages = repo.language ? [repo.language] : []
                        }

                        return {
                            name: repo.name,
                            description: repo.description || 'No description provided.',
                            stars: repo.stargazers_count,
                            forks: repo.forks_count,
                            url: repo.html_url,
                            image: PROJECT_IMAGES[repo.name] || DefaultImage,
                            languages
                        }
                    })
                )

                setProjects(withLanguages)
            } catch (error) {
                console.error('Failed to fetch GitHub repos:', error)
                setProjects([])
            } finally {
                setIsLoading(false)
            }
        }

        fetchRepos()
    }, [])

    return (
        <section id = "projects" className = {styles.section}>
            <div className = {styles.container}>

                <ScrollFade className = {styles.card}>

                    {/* Header */}
                    <div className = {styles.header}>
                        <h2 className = {styles.title}>Projects</h2>
                        <p className = {styles.subtitle}>A few things I've built and shipped, pulled live from GitHub.</p>
                    </div>

                    {/* Project cards grid */}
                    <div className = {styles.grid}>
                        {!isLoading && projects.map((project) => (
                            <ScrollFade key = {project.name} distance = {24} className = {styles.projectCard}>

                                <div className = {styles.imageWrapper}>
                                    <img src = {project.image} alt = {project.name} className = {styles.image} />
                                </div>

                                <div className = {styles.projectInfo}>
                                    <h3 className = {styles.projectName}>{project.name}</h3>
                                    <p className = {styles.projectDescription}>{project.description}</p>

                                    {project.languages.length > 0 && (
                                        <div className = {styles.languageTags}>
                                            {project.languages.map((lang) => (
                                                <span key = {lang} className = {styles.languageTag}>{lang}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className = {styles.projectMeta}>
                                    <div className = {styles.metaStats}>
                                        <span className = {styles.metaItem}>
                                            <Star size = {14} />
                                            {project.stars}
                                        </span>
                                        <span className = {styles.metaItem}>
                                            <GitFork size = {14} />
                                            {project.forks}
                                        </span>
                                    </div>

                                    <a href = {project.url} target = "_blank" rel = "noreferrer" className = {styles.linkButton}>
                                        <ExternalLink size = {14} />
                                    </a>
                                </div>

                            </ScrollFade>
                        ))}
                    </div>

                </ScrollFade>

            </div>
        </section>
    )
}
