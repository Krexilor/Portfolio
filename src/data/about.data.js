// ASSETS ------------------------------------------------------------------------------------------------------------------------------------------|
import ProfileImg from '../assets/images/Profile.jpeg'

import CIcon from '../assets/Icons/C.png'
import CppIcon from '../assets/Icons/C++.png'
import GitIcon from '../assets/Icons/Git.png'
import ViteIcon from '../assets/Icons/Vite.png'
import JavaIcon from '../assets/Icons/Java.png'
import KritaIcon from '../assets/Icons/Krita.png'
import Html5Icon from '../assets/Icons/HTML5.png'
import ReactIcon from '../assets/Icons/React.png'
import PythonIcon from '../assets/Icons/Python.png'
import BlenderIcon from '../assets/Icons/Blender.png'
import UnrealIcon from '../assets/Icons/UnrealEngine.png'
import JavaScriptIcon from '../assets/Icons/JavaScript.png'

// PROFILE CONFIG ----------------------------------------------------------------------------------------------------------------------------------|

// variant options for status: 'success' | 'info' | 'warning' | 'neutral'
export const profile = {
    photo: ProfileImg,
    name: 'Aarav Malik',
    role: 'Self-taught dev, currently deep in C++',
    location: 'Delhi, India',
    badge: {
        text: 'Open to opportunities',
        variant: 'success'
    },
    status: {
        label: 'Status',
        text: 'Currently learning',
        variant: 'success'
    },
    handle: '@Krexilor'
}

// SOCIAL LINKS ------------------------------------------------------------------------------------------------------------------------------------|
export const socialLinks = {
    github: 'https://github.com/Krexilor',
    linkedin: 'https://linkedin.com/',
    x: 'https://x.com/krexilor'
}

// BIO CONTENT ------------------------------------------------------------------------------------------------------------------------------------------|
export const bio = {
    hook: 'Started out in Blender and Unreal Engine, ended up falling into code — right now I\'m all in on C++.',
    paragraphs: [
        'Hey, I\'m Aarav — most places online you\'ll find me as Krexilor though. I got into tech through 3D and game stuff first (Blender, Unreal Engine), picked up bits of Python and C along the way, and now I\'m properly learning C++, which I\'m aiming to make my main thing.',
        'This site\'s basically part of that whole process — built it with React and Vite while figuring things out as I go. Still learning, still building, and always down to talk code, game dev, or 3D stuff if you\'re into any of that.',
        'Outside of code, I spend a lot of time in Blender and Unreal Engine messing around with 3D and small game ideas — that\'s actually what pulled me toward programming in the first place. I keep going back and forth between the two, and honestly I think that mix is what keeps things interesting for me.'
    ]
}

// STATS ------------------------------------------------------------------------------------------------------------------------------------------------|
export const stats = [
    { number: '00', caption: 'Months of Experience' },
    { number: '03', caption: 'Technologies Learned' },
    { number: '01', caption: 'Projects Completed' }
]

// SKILL DATA ------------------------------------------------------------------------------------------------------------------------------------------|
export const languageSkills = [
    { icon: CIcon, name: 'C' },
    { icon: CppIcon, name: 'C++' },
    { icon: PythonIcon, name: 'Python' },
    { icon: JavaIcon, name: 'Java' },
    { icon: JavaScriptIcon, name: 'JavaScript' },
    { icon: Html5Icon, name: 'HTML5' }
]

export const webSkills = [
    { icon: ReactIcon, name: 'React' },
    { icon: ViteIcon, name: 'Vite' }
]

export const creativeSkills = [
    { icon: BlenderIcon, name: 'Blender' },
    { icon: UnrealIcon, name: 'Unreal Engine' },
    { icon: KritaIcon, name: 'Krita' }
]

export const toolSkills = [
    { icon: GitIcon, name: 'Git' }
]

// CURRENT FOCUS AREAS -----------------------------------------------------------------------------------------------------------------------------|
export const currentFocus = [
    {
        icon: CppIcon,
        title: 'C++ Architectures',
        description: 'Deep diving into performance optimization, standard libraries, and system layers.'
    },
    {
        icon: UnrealIcon,
        title: 'Interactive Ecosystems',
        description: 'Connecting real-time graphics tooling with high-performance native code frameworks.'
    }
]
