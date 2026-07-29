import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import SiteLayout from './components/SiteLayout'
import AboutPage from './pages/AboutPage'
import FaqPage from './pages/FaqPage'
import HomePage from './pages/HomePage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import ServicePage from './pages/ServicePage'
import TermsOfServicePage from './pages/TermsOfServicePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services/:slug" element={<ServicePage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/faq" element={<FaqPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
