// Application entry point — mounts the React tree into the #root div in index.html
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// StrictMode double-invokes effects in development to surface side-effect bugs early
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
