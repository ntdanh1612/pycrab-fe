import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LandingPage } from '@/pages/landing/LandingPage'
import { MainNav } from '@/components/navigation/MainNav'
import { SessionManager } from '@/components/auth/SessionManager'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AdminRoute } from '@/components/auth/AdminRoute'
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import React, { useState, useEffect } from 'react'
import { Footer } from '@/components/landing/Footer'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { CallbackPage } from '@/pages/auth/CallbackPage'
import { Chatbot } from '@/components/chatbot/Chatbot'

// Lazy load other pages to improve initial load time
const ForgotPasswordPage = React.lazy(() => import('@/pages/auth/ForgotPasswordPage'))
const ResetPasswordPage = React.lazy(() => import('@/pages/auth/ResetPasswordPage'))
const VerifyAccountPage = React.lazy(() => import('@/pages/auth/VerifyAccountPage'))
const AdminDashboard = React.lazy(() => import('@/pages/admin/AdminDashboard'))

interface AppProps {
  initialError?: string
}

function App({ initialError }: AppProps) {
  const [error, setError] = useState<string | null>(initialError || null)

  // Auto-dismiss error after 10 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null)
      }, 10000)
      return () => clearTimeout(timer)
    }
  }, [error])

  return (
    <Router>
      <SessionManager />
      <div className="flex flex-col min-h-screen">
        {error && (
          <div className="bg-destructive/10 p-3">
            <Alert variant="destructive" className="mb-0">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}
        <MainNav />
        <main className="flex-1">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Authentication related routes */}
            <Route
              path="/forgot-password"
              element={
                <React.Suspense fallback={<div>Loading...</div>}>
                  <ForgotPasswordPage />
                </React.Suspense>
              }
            />
            <Route
              path="/reset-password"
              element={
                <React.Suspense fallback={<div>Loading...</div>}>
                  <ResetPasswordPage />
                </React.Suspense>
              }
            />
            <Route
              path="/verify/:token"
              element={
                <React.Suspense fallback={<div>Loading...</div>}>
                  <VerifyAccountPage />
                </React.Suspense>
              }
            />
            <Route path="/auth/callback" element={<CallbackPage />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route
                path="/dashboard"
                element={<div className="container py-10">Dashboard (Coming Soon)</div>}
              />
              <Route
                path="/profile"
                element={<div className="container py-10">Profile (Coming Soon)</div>}
              />
            </Route>

            {/* Admin routes */}
            <Route element={<AdminRoute />}>
              <Route
                path="/admin"
                element={
                  <React.Suspense
                    fallback={<div className="container py-10">Loading admin dashboard...</div>}
                  >
                    <AdminDashboard />
                  </React.Suspense>
                }
              />
            </Route>
          </Routes>
        </main>
        <Footer />
        <Chatbot />
      </div>
    </Router>
  )
}

export default App
