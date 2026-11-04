import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import WorkspaceTransition from './components/WorkspaceTransition'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WorkspaceTransition>
      <App />
    </WorkspaceTransition>
  </StrictMode>,
)