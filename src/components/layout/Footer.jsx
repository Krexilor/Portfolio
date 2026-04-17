// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, ArrowUpRight, ShieldCheck, Timer, Cpu } from 'lucide-react';

// STYLES ------------------------------------------------------------------------------------------------------------------------------------------|
import '../../styles/components/layout/Footer.css';

// FOOTER CONFIGURATION ----------------------------------------------------------------------------------------------------------------------------|
const FOOTER_CONFIG = {
    socials: {
        github: "https://github.com/Krexilor",
        x: "https://x.com/krexilor",
        linkedin: "https://linkedin.com/in/yourusername",
        email: "aarav.malik.pro@gmail.com"
    },
    resources: [
        { name: 'Resume', link: '/resume.pdf' },
        { name: 'Blog', link: '/blog' }
    ],
    navItems: ['Home', 'About', 'Work', 'Process', 'Contact']
};

// CUSTOM X ICON COMPONENT -------------------------------------------------------------------------------------------------------------------------|
const XIcon = ({ size = 18 }) => (
    <svg width = {size} height = {size} viewBox = "0 0 24 24" fill = "currentColor">
        <path d = "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
);

// MAIN FOOTER COMPONENT ---------------------------------------------------------------------------------------------------------------------------|
const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [uptime, setUptime] = useState('00:00:00');
    const [cpuLoad, setCpuLoad] = useState('02%');

    useEffect(() => {
        const startTime = Date.now();
        const interval = setInterval(() => {
            const diff = Math.floor((Date.now() - startTime) / 1000);
            const h = Math.floor(diff / 3600).toString().padStart(2, '0');
            const m = Math.floor((diff % 3600) / 60).toString().padStart(2, '0');
            const s = (diff % 60).toString().padStart(2, '0');
            setUptime(`${h}:${m}:${s}`);

            const load = Math.floor(Math.random() * (7 - 2 + 1) + 2);
            setCpuLoad(`${load.toString().padStart(2, '0')}%`);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Email handler for Gmail web
    const handleEmailClick = () => {
        const email = FOOTER_CONFIG.socials.email;
        const subject = "Let's get in touch";
        const body = `Hello Aarav,%0D%0A%0D%0AI wanted to reach out and say hello.%0D%0A%0D%0AFeel free to reply with anything on your mind — whether it is feedback, a question, or just a quick message.%0D%0A%0D%0ABest regards,%0D%0A[Your Name]`;
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${body}`;
        window.open(gmailUrl, '_blank');
    };

    return (
        <footer className = "footer-wrapper">
            <div className = "footer-container">
                <div className = "footer-grid">
                    
                    {/* BRANDING SECTION */}
                    <div className = "brand-section">
                        <h2 className = "footer-logo">PORTFOLIO</h2>
                        <p className = "footer-description">
                            Developing immersive Game Environments, 3D Assets, and clean, modular code. 
                            Transforming ideas into interactive real-time experiences.
                        </p>
                        <div className = "social-pill-group">
                            <a href = {FOOTER_CONFIG.socials.github} className = "social-pill" target = "_blank" rel = "noopener noreferrer">
                                <Github size = {18} />
                            </a>
                            <a href = {FOOTER_CONFIG.socials.x} className = "social-pill" target = "_blank" rel = "noopener noreferrer">
                                <XIcon />
                            </a>
                            <a href = {FOOTER_CONFIG.socials.linkedin} className = "social-pill" target = "_blank" rel = "noopener noreferrer">
                                <Linkedin size = {18} />
                            </a>
                            <button 
                                type = "button"
                                className = "social-pill" 
                                onClick = {handleEmailClick}
                            >
                                <Mail size = {18} />
                            </button>
                        </div>
                    </div>

                    {/* INTERNAL NAVIGATION INDEX */}
                    <div className = "nav-section">
                        <h4 className = "section-label">Index</h4>
                        <nav className = "footer-nav">
                            {FOOTER_CONFIG.navItems.map((item) => (
                                <button 
                                    type = "button"
                                    key = {item}
                                    onClick = {() =>
                                        document
                                            .getElementById(item.toLowerCase())
                                            ?.scrollIntoView({ behavior: 'smooth' })
                                    }
                                    className = "footer-nav-link"
                                >
                                    <span>{item}</span>
                                    <ArrowUpRight size = {14} className = "nav-arrow-icon" />
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* EXTERNAL RESOURCES */}
                    <div className = "nav-section">
                        <h4 className = "section-label">Resources</h4>
                        <nav className = "footer-nav">
                            {FOOTER_CONFIG.resources.map((item) => (
                                <a 
                                    key = {item.name}
                                    href = {item.link}
                                    className = "footer-nav-link"
                                    target = "_blank" 
                                    rel = "noopener noreferrer"
                                >
                                    <span>{item.name}</span>
                                    <ArrowUpRight size = {14} className = "nav-arrow-icon" />
                                </a>
                            ))}
                        </nav>
                    </div>

                </div>
            </div>

            {/* SYSTEM STATUS BAR */}
            <div className = "system-bar">
                <div className = "system-bar-container">
                    <div className = "system-left">
                        <div className = "system-data-point">
                            <ShieldCheck size = {11} className = "text-sky-500" />
                            <span>SECURE ACCESS</span>
                        </div>
                        <div className = "system-divider"></div>
                        <div className = "system-data-point">
                            <Timer size = {11} className = "text-sky-500" />
                            <span>UPTIME: {uptime}</span>
                        </div>
                        <div className = "system-divider"></div>
                        <div className = "system-data-point">
                            <Cpu size = {11} className = "text-sky-500" />
                            <span>LOAD: {cpuLoad}</span>
                        </div>
                        <div className = "system-divider"></div>
                        <span className = "system-copyright">
                            © {currentYear} CREATED BY AARAV MALIK
                        </span>
                    </div>
                    
                    <div className = "system-right">
                        <button 
                            onClick = {() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
                            className = "scroll-top-btn group"
                        >
                            <span className = "text-[10px]">SCROLL TO TOP</span>
                            <ArrowUpRight size = {14} className = "top-arrow" />
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

// EXPORT FOOTER COMPONENT -------------------------------------------------------------------------------------------------------------------------|
export default Footer;
