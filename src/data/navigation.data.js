// NAVIGATION DATA ---------------------------------------------------------------------------------------------------------------------------------|
export const navLinks = [
    { type: "hash", hash: "#home", label: "Home" },
    { type: "hash", hash: "#about", label: "Journey" },
    { type: "hash", hash: "#work", label: "Projects" },
    { type: "hash", hash: "#lab", label: "Lab" },
    { type: "route", to: "/blog", label: "Blog" },
    { type: "hash", hash: "#contact", label: "Contact" }
]

export const sectionLinks = navLinks.filter((item) => item.type === "hash")

export const pageLinks = [
    { to: "/blog", label: "Blog" },
    { to: "/resume", label: "Resume" }
]
