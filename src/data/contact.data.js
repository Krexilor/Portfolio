// DATA --------------------------------------------------------------------------------------------------------------------------------------------|
import { profile } from './about.data.js'

// CONTACT INFO ------------------------------------------------------------------------------------------------------------------------------------|
export const contactInfo = {
    title: 'Contact',
    subtitle: 'Have a project, an idea, or just want to say hi? Send a message and I\'ll get back to you.',
    email: 'aarav.malik.pro@gmail.com',
    location: profile.location,
    availability: 'Usually replies within a day or two'
}

// FORM CONFIG -------------------------------------------------------------------------------------------------------------------------------------|
export const formConfig = {
    maxMessageLength: 1000,
    messageRows: 6,
    submitLabel: 'Send message',
    successMessage: 'Message sent. Thanks for reaching out!',
    fields: {
        name: { label: 'Name', placeholder: 'Your name' },
        email: { label: 'Email', placeholder: 'you@example.com' },
        subject: { label: 'Subject', placeholder: 'What\'s this about?' },
        message: { label: 'Message', placeholder: 'Tell me a bit about what you have in mind...' }
    }
}
