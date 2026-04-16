// CUSTOM CURSOR UTILS -----------------------------------------------------------------------------------------------------------------------------|
export const getHoverType = (target) => {
    if (!target) return 'none'

    const computedStyle = window.getComputedStyle(target)

    if (target.closest('input, textarea, .terminal-hover')) {
        return 'terminal'
    }

    if (target.closest('button, .action-hover')) {
        return 'action'
    }

    if (target.closest('a, .link-hover')) {
        return 'link'
    }

    if (computedStyle.cursor === 'pointer') {
        return 'link'
    }

    return 'none'
}