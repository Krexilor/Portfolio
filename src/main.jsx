// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

// APPLICATION -------------------------------------------------------------------------------------------------------------------------------------|
import App from './App.jsx'

// GLOBAL STYLES -----------------------------------------------------------------------------------------------------------------------------------|
import './styles/globals.css'

// ENTRY POINT -------------------------------------------------------------------------------------------------------------------------------------|
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
)
