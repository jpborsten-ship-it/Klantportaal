import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { DeliveryPlanningProvider } from './state/DeliveryPlanningContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <DeliveryPlanningProvider>
        <App />
      </DeliveryPlanningProvider>
    </BrowserRouter>
  </StrictMode>,
)
