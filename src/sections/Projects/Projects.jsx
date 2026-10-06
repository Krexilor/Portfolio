// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { useState, useEffect, useRef } from 'react'
import { Star, GitFork, ArrowUpRight, ChevronLeft, ChevronRight, Globe, FolderGit2 } from 'lucide-react'

// STYLES ------------------------------------------------------------------------------------------------------------------------------------------|
import styles from './Projects.module.css'

// COMPONENTS --------------------------------------------------------------------------------------------------------------------------------------|
import { GithubBtn } from '../../components/Common/Button/Button.jsx'

// ASSETS ------------------------------------------------------------------------------------------------------------------------------------------|
import DefaultImage from '../../assets/Images/BrokenImage.png'

// DATA --------------------------------------------------------------------------------------------------------------------------------------------|
import { GITHUB_USERNAME, ALLOWED_REPOS, PROJECT_IMAGES, SLIDE_INTERVAL } from '../../data/projects.data.js'

// HELPERS -----------------------------------------------------------------------------------------------------------------------------------------|
const formatDate = (value) => new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(new Date(value))
const formatCount = (value) => String(value).padStart(2, '0')

// PROJECTS SECTION --------------------------------------------------------------------------------------------------------------------------------|
export default function ProjectsSection() {
    const [projects, setProjects] = useState([])
    const [selectedName, setSelectedName] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)
    const [prefersReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)

    const listRef = useRef(null)

    useEffect(() => {
        let isActive = true

        async function fetchRepos() {
            try {
                const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`)

                if (!response.ok) throw new Error(`GitHub responded with ${response.status}`)

                const data = await response.json()

                const filtered = data
                    .filter((repo) => ALLOWED_REPOS.includes(repo.name))
                    .sort((a, b) => ALLOWED_REPOS.indexOf(a.name) - ALLOWED_REPOS.indexOf(b.name))

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
                            homepage: repo.homepage?.startsWith('http') ? repo.homepage : '',
                            updated: repo.pushed_at,
                            image: PROJECT_IMAGES[repo.name] || DefaultImage,
                            languages
                        }
                    })
                )

                if (isActive) setProjects(withLanguages)
            } catch (error) {
                console.error('Failed to fetch GitHub repos:', error)

                if (isActive) {
                    setProjects([])
                    setHasError(true)
                }
            } finally {
                if (isActive) setIsLoading(false)
            }
        }

        fetchRepos()

        return () => {
            isActive = false
        }
    }, [])

    const selected = projects.find((project) => project.name === selectedName) || projects[0]
    const activeIndex = selected ? projects.indexOf(selected) : 0
    const canSlide = projects.length > 1
    const isAutoplay = canSlide && !prefersReducedMotion
    const totalStars = projects.reduce((sum, project) => sum + project.stars, 0)
    const totalForks = projects.reduce((sum, project) => sum + project.forks, 0)
    const showEmpty = !isLoading && projects.length === 0

    const goTo = (index) => {
        const next = projects[(index + projects.length) % projects.length]

        if (next) setSelectedName(next.name)
    }

    useEffect(() => {
        const list = listRef.current
        const active = list?.querySelector('[aria-current="true"]')

        if (!list || !active) return

        list.scrollTo({
            top: Math.max(0, active.offsetTop - (list.clientHeight - active.offsetHeight) / 2),
            left: Math.max(0, active.offsetLeft - (list.clientWidth - active.offsetWidth) / 2),
            behavior: 'smooth'
        })
    }, [selected?.name])

    return (
        <section id = "projects" className = {styles.section}>
            <div className = {styles.grid}>

                {/* Info + List Card */}
                <div className = {`${styles.card} ${styles.infoCard}`}>

                    <div className = {styles.infoHeader}>
                        <div className = {styles.titleRow}>
                            <span className = {styles.titleIcon}><FolderGit2 size = {18} /></span>
                            <h2 className = {styles.title}>Projects</h2>
                        </div>

                        <p className = {styles.subtitle}>A few things I've built and shipped, pulled live from GitHub.</p>
                    </div>

                    <div className = {styles.divider} />

                    {/* Totals */}
                    <div className = {styles.stats}>
                        <div className = {styles.stat}>
                            <span className = {styles.statNumber}>{isLoading ? '--' : formatCount(projects.length)}</span>
                            <span className = {styles.statCaption}>Projects</span>
                        </div>

                        <div className = {styles.stat}>
                            <span className = {styles.statNumber}>{isLoading ? '--' : formatCount(totalStars)}</span>
                            <span className = {styles.statCaption}>Stars</span>
                        </div>

                        <div className = {styles.stat}>
                            <span className = {styles.statNumber}>{isLoading ? '--' : formatCount(totalForks)}</span>
                            <span className = {styles.statCaption}>Forks</span>
                        </div>
                    </div>

                    {/* Project list */}
                    {!showEmpty && (
                        <div className = {styles.group}>
                            <span className = {styles.groupLabel}>All projects</span>

                            <div className = {styles.listWrap}>
                                <div ref = {listRef} className = {styles.list}>

                                    {isLoading && [0, 1, 2].map((index) => (
                                        <div key = {index} className = {styles.skeletonItem} aria-hidden = "true" />
                                    ))}

                                    {!isLoading && projects.map((project) => {
                                        const isSelected = project.name === selected.name

                                        return (
                                            <button
                                                key = {project.name}
                                                type = "button"
                                                className = {`${styles.listItem} ${isSelected ? styles.listItemActive : ''}`}
                                                onClick = {() => setSelectedName(project.name)}
                                                aria-current = {isSelected ? 'true' : undefined}
                                            >
                                                <img src = {project.image} alt = "" className = {styles.thumb} />

                                                <span className = {styles.listText}>
                                                    <span className = {styles.listName}>{project.name}</span>
                                                    <span className = {styles.listMeta}>
                                                        {project.languages.slice(0, 3).join(' · ') || 'Repository'}
                                                    </span>
                                                </span>

                                                <ChevronRight size = {14} className = {styles.listArrow} />
                                            </button>
                                        )
                                    })}

                                </div>
                            </div>
                        </div>
                    )}

                    {/* GitHub profile */}
                    <div className = {styles.footer}>
                        <GithubBtn className = {styles.profileLink} />
                    </div>

                </div>

                {/* Detail Card */}
                <div className = {`${styles.card} ${styles.detailCard}`}>

                    {isLoading && <div className = {styles.skeletonDetail} aria-hidden = "true" />}

                    {showEmpty && (
                        <div className = {styles.messageBox}>
                            <p className = {styles.message}>
                                {hasError
                                    ? 'Couldn\'t load projects from GitHub right now. Try again later, or browse them directly.'
                                    : 'No projects to show yet. Check back soon.'}
                            </p>

                            <a
                                href = {`https://github.com/${GITHUB_USERNAME}`}
                                target = "_blank"
                                rel = "noreferrer"
                                className = {styles.linkButton}
                            >
                                Open GitHub profile
                                <ArrowUpRight size = {14} />
                            </a>
                        </div>
                    )}

                    {!isLoading && selected && (
                        <div key = {selected.name} className = {styles.detail}>

                            {/* Preview */}
                            <div className = {styles.stage}>
                                <img src = {selected.image} alt = "" aria-hidden = "true" className = {styles.stageBackdrop} />
                                <img src = {selected.image} alt = {selected.name} className = {styles.stageImage} />

                                {canSlide && (
                                    <span className = {styles.counter}>
                                        {formatCount(activeIndex + 1)} / {formatCount(projects.length)}
                                    </span>
                                )}
                            </div>

                            {/* Slideshow controls */}
                            {canSlide && (
                                <div className = {styles.controls} style = {{ '--slide-duration': `${SLIDE_INTERVAL}ms` }}>
                                    <div className = {styles.segments}>
                                        {projects.map((project, index) => {
                                            const isActive = index === activeIndex
                                            const isRunning = isActive && isAutoplay
                                            const isDone = index < activeIndex || (isActive && !isAutoplay)

                                            return (
                                                <button
                                                    key = {project.name}
                                                    type = "button"
                                                    className = {styles.segment}
                                                    onClick = {() => goTo(index)}
                                                    aria-label = {`Show ${project.name}`}
                                                >
                                                    <span className = {styles.segmentTrack}>
                                                        <span
                                                            key = {`${isRunning ? 'running' : 'idle'}-${project.name}`}
                                                            className = {`${styles.segmentFill} ${isDone ? styles.segmentDone : ''} ${isRunning ? styles.segmentRunning : ''}`}
                                                            onAnimationEnd = {isRunning ? () => goTo(index + 1) : undefined}
                                                        />
                                                    </span>
                                                </button>
                                            )
                                        })}
                                    </div>

                                    <div className = {styles.arrows}>
                                        <button type = "button" className = {styles.arrow} onClick = {() => goTo(activeIndex - 1)} aria-label = "Previous project">
                                            <ChevronLeft size = {16} />
                                        </button>

                                        <button type = "button" className = {styles.arrow} onClick = {() => goTo(activeIndex + 1)} aria-label = "Next project">
                                            <ChevronRight size = {16} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Info */}
                            <div className = {styles.detailInfo}>
                                <div className = {styles.detailHeader}>
                                    <h3 className = {styles.detailName}>{selected.name}</h3>
                                    <span className = {styles.updated}>Updated {formatDate(selected.updated)}</span>
                                </div>

                                <p className = {styles.detailDescription}>{selected.description}</p>

                                {selected.languages.length > 0 && (
                                    <div className = {styles.languageTags}>
                                        {selected.languages.map((lang) => (
                                            <span key = {lang} className = {styles.languageTag}>{lang}</span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className = {styles.detailMeta}>
                                <div className = {styles.metaStats}>
                                    <span className = {styles.metaItem}>
                                        <Star size = {14} />
                                        {selected.stars}
                                    </span>
                                    <span className = {styles.metaItem}>
                                        <GitFork size = {14} />
                                        {selected.forks}
                                    </span>
                                </div>

                                <div className = {styles.actions}>
                                    {selected.homepage && (
                                        <a href = {selected.homepage} target = "_blank" rel = "noreferrer" className = {styles.linkButton}>
                                            <Globe size = {14} />
                                            Live
                                        </a>
                                    )}

                                    <a href = {selected.url} target = "_blank" rel = "noreferrer" className = {styles.linkButton}>
                                        Code
                                        <ArrowUpRight size = {14} />
                                    </a>
                                </div>
                            </div>

                        </div>
                    )}

                </div>

            </div>
        </section>
    )
}
