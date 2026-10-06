// DATA --------------------------------------------------------------------------------------------------------------------------------------------|
import { contactInfo } from './contact.data.js'
import { profile, languageSkills, webSkills, creativeSkills, toolSkills } from './about.data.js'

// HELPERS -----------------------------------------------------------------------------------------------------------------------------------------|
const names = (skills) => skills.map((skill) => skill.name).join(', ')

// TERMINAL CONFIG ---------------------------------------------------------------------------------------------------------------------------------|
export const terminalConfig = {
    prompt: 'krexilor@lab:~$',
    title: 'krexilor@lab: ~',
    shell: 'bash',
    placeholder: 'type \'help\'',
    welcome: [
        'Welcome to the lab.',
        'Type "help" to see all available commands.'
    ]
}

// COMMANDS ----------------------------------------------------------------------------------------------------------------------------------------|
export const commands = [
    { name: 'help', description: 'List all commands' },
    {
        name: 'about',
        description: 'Who I am',
        output: [
            'Hey, I\'m Aarav (most people online know me as Krexilor).',
            `Self-taught dev from ${profile.location}, currently deep in C++.`,
            'Started out in Blender and Unreal Engine, fell into code, and never looked back.'
        ]
    },
    {
        name: 'skills',
        description: 'What I work with',
        output: [
            {
                type: 'rows',
                rows: [
                    ['Languages', names(languageSkills)],
                    ['Web', names(webSkills)],
                    ['3D & Games', names(creativeSkills)],
                    ['Tools', names(toolSkills)]
                ]
            }
        ]
    },
    {
        name: 'projects',
        description: 'Things I\'ve built',
        output: [
            'My projects live in the Projects section, pulled live from GitHub.',
            { type: 'link', label: 'Open', href: '#projects', text: 'Projects section' },
            { type: 'link', label: 'GitHub', href: 'https://github.com/Krexilor?tab=repositories', text: 'github.com/Krexilor' }
        ]
    },
    {
        name: 'contact',
        description: 'How to reach me',
        output: [
            { type: 'link', label: 'Email', href: `mailto:${contactInfo.email}`, text: contactInfo.email },
            { type: 'rows', rows: [['Location', contactInfo.location]] },
            { type: 'link', label: 'Form', href: '#contact', text: 'Use the contact form' }
        ]
    },
    {
        name: 'socials',
        description: 'Find me online',
        output: [
            { type: 'link', label: 'GitHub', href: 'https://github.com/Krexilor', text: 'github.com/Krexilor' },
            { type: 'link', label: 'LinkedIn', href: 'https://www.linkedin.com/in/aaravmalik-pro/', text: 'linkedin.com' },
            { type: 'link', label: 'X', href: 'https://x.com/krexilor', text: 'x.com/krexilor' }
        ]
    },
    {
        name: 'whoami',
        description: 'Who am I, really?',
        output: [
            'krexilor',
            'uid=1000(krexilor) gid=1000(devs) groups=c++,blender,coffee',
            'Professional bug creator, amateur bug fixer.'
        ]
    },
    {
        name: 'joke',
        description: 'A questionable dev joke',
        random: [
            ['Why do programmers prefer dark mode?', 'Because light attracts bugs.'],
            ['There are 10 kinds of people in the world.', 'Those who understand binary, and those who don\'t.'],
            ['A SQL query walks into a bar, sees two tables and asks:', '"Can I join you?"'],
            ['99 little bugs in the code. Take one down, patch it around...', '127 little bugs in the code.'],
            ['My code doesn\'t have bugs.', 'It has surprise features.'],
            ['"It works on my machine."', 'Great, we\'ll ship your machine.'],
            ['In C you shoot yourself in the foot.', 'In C++ you blow off your whole leg.'],
            ['I\'d tell you a UDP joke,', 'but you might not get it.']
        ]
    },
    {
        name: 'hire',
        description: 'Hire me (please)',
        output: [
            'Excellent decision.',
            'I\'m open to opportunities, internships and collaborations.',
            { type: 'link', label: 'Email', href: `mailto:${contactInfo.email}`, text: contactInfo.email },
            { type: 'link', label: 'Form', href: '#contact', text: 'Use the contact form' }
        ]
    },
    { name: 'clear', description: 'Clear the screen' },
    {
        name: 'sudo',
        hidden: true,
        output: ['Nice try. You have no power here.']
    },
    {
        name: 'coffee',
        hidden: true,
        output: [
            'Brewing...',
            '[##########] 100%',
            'Coffee ready. Productivity up 10%, bugs up 15%.'
        ]
    },
    {
        name: 'ls',
        hidden: true,
        output: ['about  skills  projects  contact  socials  secrets.txt']
    }
]

// UNKNOWN COMMAND RESPONSES -----------------------------------------------------------------------------------------------------------------------|
export const unknownResponses = [
    'Alright, "{command}" is not a thing. Type "help" to try something real.',
    '"{command}"? Bold move. Wrong, but bold.',
    'I don\'t know "{command}", but I respect the confidence.',
    'Nope. "{command}" is not in my vocabulary. Yet.',
    'Command "{command}" not found. I checked twice. Even the second time.',
    '"{command}" went out for coffee and never came back.',
    'That did absolutely nothing. Impressive, honestly.',
    'I tried "{command}" and now I\'m confused. Thanks for that.'
]
