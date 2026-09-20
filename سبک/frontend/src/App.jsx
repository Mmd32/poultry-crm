import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Customers from './pages/Customers'
import Farms from './pages/Farms'
import Sales from './pages/Sales'
import Reminders from './pages/Reminders'
import Feedbacks from './pages/Feedbacks'
import Churn from './pages/Churn'
import Offers from './pages/Offers'

function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/farms" element={<Farms />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/reminders" element={<Reminders />} />
        <Route path="/feedbacks" element={<Feedbacks />} />
        <Route path="/churn" element={<Churn />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
