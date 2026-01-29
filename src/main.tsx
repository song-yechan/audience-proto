import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ZIndexContextProvider } from '@airbridge/component'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ZIndexContextProvider>
      <App />
    </ZIndexContextProvider>
  </StrictMode>,
)
