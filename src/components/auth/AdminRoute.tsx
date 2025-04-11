import React, { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth.store'
import { supabaseAuthService } from '@/services/auth.supabase'

export function AdminRoute() {
  const { isAuthenticated } = useAuthStore()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!isAuthenticated) {
        setIsAdmin(false)
        setLoading(false)
        return
      }

      try {
        const adminStatus = await supabaseAuthService.isAdmin()
        setIsAdmin(adminStatus)
      } catch (error) {
        console.error('Error checking admin status:', error)
        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    }

    checkAdminStatus()
  }, [isAuthenticated])

  if (loading) {
    return (
      <div className="container py-10 flex justify-center items-center">
        <p>Checking permissions...</p>
      </div>
    )
  }

  // If not authenticated or not admin, redirect to login
  if (!isAuthenticated || isAdmin === false) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // If admin, render the child routes
  return <Outlet />
}
