import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initService } from './services/init.service'

// Initialize services
initService
  .initialize()
  .then(() => {
    console.log('Services initialized, rendering app...')

    // Render the app
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <App />
      </StrictMode>
    )
  })
  .catch((error) => {
    console.error('Failed to initialize services:', error)

    // Still render the app, but display an error notification
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <App initialError="Failed to connect to services. Some features may not work properly." />
      </StrictMode>
    )
  })
