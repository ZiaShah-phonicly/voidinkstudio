import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import SiteLayout from './components/SiteLayout'
import AboutPage from './pages/AboutPage'
import FaqPage from './pages/FaqPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import RegisterPage from './pages/RegisterPage'
import ServicePage from './pages/ServicePage'
import TermsOfServicePage from './pages/TermsOfServicePage'
import AdminLayout from './pages/admin/AdminLayout'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminCrmPage from './pages/admin/AdminCrmPage'
import AdminOrdersPage from './pages/admin/AdminOrdersPage'
import AdminUsersPage from './pages/admin/AdminUsersPage'
import TrackOrderPage from './pages/TrackOrderPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminOrdersPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="crm" element={<AdminCrmPage />} />
        </Route>

        <Route element={<SiteLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services/:slug" element={<ServicePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/track" element={<TrackOrderPage />} />
          <Route path="/track/:trackingId" element={<TrackOrderPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/faq" element={<FaqPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
