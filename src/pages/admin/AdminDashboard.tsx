import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserManagement } from '@/components/admin/UserManagement'
import { supabaseAuthService } from '@/services/auth.supabase'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        setLoading(true)
        const adminStatus = await supabaseAuthService.isAdmin()
        setIsAdmin(adminStatus)
        
        // If not admin, redirect to home
        if (!adminStatus) {
          navigate('/')
        }
      } catch (error) {
        console.error('Error checking admin status:', error)
        navigate('/')
      } finally {
        setLoading(false)
      }
    }
    
    checkAdmin()
  }, [navigate])
  
  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex justify-center items-center min-h-[300px]">
          <p>Loading...</p>
        </div>
      </div>
    )
  }
  
  if (!isAdmin) {
    return null // Will redirect in the useEffect
  }
  
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the admin area. Manage users and site settings here.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow border border-accent/10">
          <h3 className="text-lg font-bold">Total Users</h3>
          <p className="text-3xl font-bold text-primary mt-2">27</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border border-accent/10">
          <h3 className="text-lg font-bold">New Users (7 days)</h3>
          <p className="text-3xl font-bold text-primary mt-2">5</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border border-accent/10">
          <h3 className="text-lg font-bold">Admin Users</h3>
          <p className="text-3xl font-bold text-primary mt-2">1</p>
        </div>
      </div>
      
      <div className="mt-8">
        <UserManagement />
      </div>
    </div>
  )
} 