import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import SiteLayout from './components/SiteLayout'
import AboutPage from './pages/AboutPage'
import FaqPage from './pages/FaqPage'
import FursuitPage from './pages/FursuitPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import ServicePage from './pages/ServicePage'
import TermsOfServicePage from './pages/TermsOfServicePage'
import TrackOrderPage from './pages/TrackOrderPage'
import UnsubscribePage from './pages/UnsubscribePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/fursuits" element={<Navigate to="/services/fursuits" replace />} />
          <Route path="/services/fursuits" element={<FursuitPage />} />
          <Route path="/services/:slug" element={<ServicePage />} />
          <Route path="/track" element={<TrackOrderPage />} />
          <Route path="/track/:trackingId" element={<TrackOrderPage />} />
          <Route path="/unsubscribe" element={<UnsubscribePage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
