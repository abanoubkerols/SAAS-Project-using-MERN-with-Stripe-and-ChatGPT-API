import { Routes, BrowserRouter, Route } from 'react-router-dom'
import Registration from './components/Users/Register'
import Login from './components/Users/Login'
import Dashboard from './components/Users/Dashboard'
import PrivateNavbar from './components/Navbar.js/privateNavbar'
import PublicNavbar from './components/Navbar.js/publicNavbar'
import Home from './components/Home/Home'
import { useAuth } from './AuthContext/AuthContext'
import AuthRoute from './components/AuthRoute/AuthRoute'
import BlogPostAIAssistant from './components/ContentGeneration/ContentGeneration'
import Plans from './components/Plan/PricingPlan'
import FreePlanSignup from './components/Stripe/FreePlanSignup'
import CheckoutForm from './components/Stripe/CheckOutForm'
import PaymentSuccess from './components/Stripe/PaymentSuccess'
import ContentGenerationHistory from './components/ContentGeneration/ContentGenerationHistory'
import AppFeatures from './components/Features/Features'
import AboutUs from './components/About/About'

export default function App () {
  const { isAuthenticated } = useAuth()
  return (
    <>
      <BrowserRouter>
        {isAuthenticated ? <PrivateNavbar /> : <PublicNavbar />}

        <Routes>
          <Route path='/register' element={<Registration />} />
          <Route path='/login' element={<Login />} />
          <Route
            path='/dashboard'
            element={
              <AuthRoute>
                <Dashboard />
              </AuthRoute>
            }
          />
          <Route
            path='/generate-content'
            element={
              <AuthRoute>
                <BlogPostAIAssistant />
              </AuthRoute>
            }
          />
          <Route
            path='/history'
            element={
              <AuthRoute>
                <ContentGenerationHistory />
              </AuthRoute>
            }
          />
          <Route path='/' element={<Home />} />
          <Route path='/plans' element={<Plans />} />
          <Route
            path='/free-plan'
            element={
              <AuthRoute>
                <FreePlanSignup />
              </AuthRoute>
            }
          />
          <Route
            path='/checkout/:plan'
            element={
              <AuthRoute>
                <CheckoutForm />
              </AuthRoute>
            }
          />
          <Route
            path='/success'
            element={
              <AuthRoute>
                <PaymentSuccess />
              </AuthRoute>
            }
          />
          <Route path='/features' element={<AppFeatures />} />
          <Route path='/about' element={<AboutUs />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}
