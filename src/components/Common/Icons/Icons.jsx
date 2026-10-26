// ICON BASE ---------------------------------------------------------------------------------------------------------------------------------------|
function Icon({ size, className, children }) {
    return (
        <svg
            className = {className}
            viewBox = "0 0 16 16"
            width = {size}
            height = {size}
            fill = "none"
            stroke = "currentColor"
            strokeWidth = "1.6"
            strokeLinecap = "round"
            strokeLinejoin = "round"
            aria-hidden = "true"
        >
            {children}
        </svg>
    )
}

// ICONS -------------------------------------------------------------------------------------------------------------------------------------------|
export function ArrowUp({ size = 12, className = "" }) {
    return (
        <Icon size = {size} className = {className}>
            <path d = "M8 13V3M3.5 7.5L8 3L12.5 7.5" />
        </Icon>
    )
}

export function ArrowUpRight({ size = 12, className = "" }) {
    return (
        <Icon size = {size} className = {className}>
            <path d = "M4 12L12 4M5.5 4H12V10.5" />
        </Icon>
    )
}
