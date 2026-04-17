// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { useState, useEffect, useRef, useMemo } from 'react'
import { Home, User, Briefcase, Cpu, Mail } from 'lucide-react'

// STYLES ------------------------------------------------------------------------------------------------------------------------------------------|
import '../../styles/components/layout/Navbar.css'

// NAVBAR COMPONENT --------------------------------------------------------------------------------------------------------------------------------|
const Navbar = () => {
    const [activeTab, setActiveTab] = useState('home');
    const [hoveredTab, setHoveredTab] = useState(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const navRef = useRef(null);
    const buttonRefs = useRef({});

    const tabs = useMemo(() => [
        { id: 'home', label: 'Home', icon: <Home size = {18} /> },
        { id: 'about', label: 'About', icon: <User size = {18} /> },
        { id: 'work', label: 'Work', icon: <Briefcase size = {18} /> },
        { id: 'process', label: 'Process', icon: <Cpu size = {18} /> },
        { id: 'contact', label: 'Contact', icon: <Mail size = {18} /> }
    ], []);

    useEffect(() => {
        const activeBtn = buttonRefs.current[activeTab];
        if (activeBtn && navRef.current) {
            const left = activeBtn.offsetLeft;
            const width = activeBtn.offsetWidth;

            navRef.current.style.setProperty('--indicator-left', `${left + (width * 0.225)}px`);
            navRef.current.style.setProperty('--indicator-width', `${width * 0.55}px`);
            navRef.current.style.setProperty('--indicator-opacity', '1');
        }
    }, [activeTab]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const trigger = scrollY + (window.innerHeight / 3);

            if (scrollY < 50) {
                setActiveTab('home');
                return;
            }

            for (const tab of tabs) {
                const section = document.getElementById(tab.id);
                
                if (section) {
                    const top = section.offsetTop;
                    const bottom = top + section.offsetHeight;
                    
                    if (trigger >= top && trigger <= bottom) {
                        setActiveTab(tab.id);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [tabs]);

    const handleMouseMove = (e) => {
        if (!navRef.current) return;
        const rect = navRef.current.getBoundingClientRect();
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    return (
        <div className = "fixed top-10 left-0 w-full flex justify-center z-50 px-6">
            <nav ref = {navRef} onMouseMove = {handleMouseMove} className = "nav-container group">
                <div
                    className = "cursor-glow"
                    style = {{ background: `radial-gradient(120px circle at ${mousePos.x}px ${mousePos.y}px, rgba(56, 189, 248, 0.1), transparent 100%)` }}
                />
                <div className = "active-indicator" />
                
                {tabs.map((tab) => (
                    <button 
                        type = "button"
                        key = {tab.id}
                        ref = {el => buttonRefs.current[tab.id] = el}
                        onClick = {() => document.getElementById(tab.id)?.scrollIntoView({ behavior: 'smooth' })}
                        onMouseEnter = {() => setHoveredTab(tab.id)}
                        onMouseLeave = {() => setHoveredTab(null)}
                        className = {`nav-button ${activeTab === tab.id ? 'active' : 'inactive'}`}
                    >
                        <div className = {`button-content ${activeTab === tab.id || hoveredTab === tab.id ? 'scale-up' : ''}`}>
                            <span className = {`icon-wrapper ${activeTab === tab.id ? 'active-icon' : ''}`}>
                                {tab.icon}
                            </span>
                            <span className = "button-text">
                                {tab.label}
                            </span>
                        </div>
                    </button>
                ))}
            </nav>
        </div>
    )
}

// EXPORTS -----------------------------------------------------------------------------------------------------------------------------------------|
export default Navbar
