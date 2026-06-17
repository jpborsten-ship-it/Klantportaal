import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'
import Dashboard from './pages/Dashboard'
import Orders from './pages/Orders'
import OrderDetail from './pages/OrderDetail'
import Finance from './pages/Finance'
import Leveragenda from './pages/Leveragenda'
import MijnGegevens from './pages/MijnGegevens'
import Retouren from './pages/Retouren'
import Faq from './pages/Faq'
import './App.css'

function App() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">
        <Topbar />
        <main className="app-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:orderId" element={<OrderDetail />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/leveragenda" element={<Leveragenda />} />
            <Route path="/mijn-gegevens" element={<MijnGegevens />} />
            <Route path="/retouren" element={<Retouren />} />
            <Route path="/faq" element={<Faq />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
