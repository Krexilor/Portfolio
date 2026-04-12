// CUSTOM CURSOR UTILS -----------------------------------------------------------------------------------------------------------------------------|
export const getHoverType = (target) => {
    const computedStyle = window.getComputedStyle(target)
  
    if (target.tagName === 'A' || target.closest('.link-hover')) {
        return 'link'
    }
    if (target.tagName === 'BUTTON' || target.closest('.action-hover')) {
        return 'action'
    }
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.closest('.terminal-hover')) {
        return 'terminal'
    }
    if (computedStyle.cursor === 'pointer') {
        return 'link'
    }
  
    return 'none'
}

// 
