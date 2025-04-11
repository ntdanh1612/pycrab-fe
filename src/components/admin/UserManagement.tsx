import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/stores/auth.store'
import { supabaseAuthService } from '@/services/auth.supabase'
import type { User } from '@/types/auth'

export function UserManagement() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  
  useEffect(() => {
    const checkAdminAndLoadUsers = async () => {
      try {
        setLoading(true)
        
        // Check if user is admin
        const adminStatus = await supabaseAuthService.isAdmin()
        setIsAdmin(adminStatus)
        
        if (!adminStatus) {
          setError('You do not have permission to access this page')
          return
        }
        
        // Load users
        const userList = await supabaseAuthService.getAllUsers()
        setUsers(userList)
        setError(null)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load users')
        console.error('Error loading users:', error)
      } finally {
        setLoading(false)
      }
    }
    
    checkAdminAndLoadUsers()
  }, [])
  
  if (!isAdmin && !loading) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-red-500">Access Denied</CardTitle>
        </CardHeader>
        <CardContent>
          <p>You do not have permission to access this admin area.</p>
          <Button
            onClick={() => navigate('/')}
            className="mt-4"
          >
            Return to Home
          </Button>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card className="mx-auto">
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-4">Loading users...</div>
        ) : error ? (
          <div className="text-red-500 p-4">{error}</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'admin' ? 'destructive' : 'default'}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {/* Assuming verification status from profile.is_verified */}
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                      {user.role === 'admin' ? 'Yes' : 'No'}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="mr-2">
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm">
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
} 