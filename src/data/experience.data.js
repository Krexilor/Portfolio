// EXPERIENCE CONFIG -------------------------------------------------------------------------------------------------------------------------------|

// showPlaceholder: true = show placeholder entry, false = hide placeholder entry
export const experienceConfig = {
    showPlaceholder: true,
    placeholder: {
        hint: 'Entry pending',
        role: 'Your Company\'s Next Hire',
        company: 'Position open since day one',
        period: 'Start date: TBD',
        message: 'Zero years of experience, 100% enthusiasm. My bugs are free-range and my commits are organic. Give me a shot and this timeline gets its very first entry.',
        perks: [
            'Learning C++ at full speed, debugging at full volume.',
            'Turns coffee into code (the code compiles about half the time).',
            'Will happily put your company name here in a very large font.'
        ],
        status: 'Open to opportunities',
        statusMeta: 'Zero roles so far, ready to start',
        techLabel: 'Ready to work with',
        ctaLabel: 'Hire me',
        ctaTarget: '#contact',
        secondaryLabel: 'Or just email me'
    }
}

// EXPERIENCE ENTRIES ------------------------------------------------------------------------------------------------------------------------------|

// set `current: true` on the role for current employment
export const experiences = [
    {
        id: 'exp-1',
        role: 'Role Title',
        company: 'Company Name',
        period: 'Mon YYYY - Present',
        current: true,
        description: 'A short summary of what you worked on here and the impact it had.',
        highlights: [
            'Key achievement or responsibility goes here.',
            'Another achievement, ideally with a measurable result.'
        ],
        tags: ['C++', 'Unreal Engine']
    }
]
