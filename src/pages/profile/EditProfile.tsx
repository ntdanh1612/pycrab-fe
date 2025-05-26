import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth.store'
import { useProfileStore } from '@/stores/profile.store'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { AlertCircle, ArrowLeft, Loader2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function EditProfile() {
  const { user, setUser } = useAuthStore()
  const { updateProfileInfo, loading, error, clearError } = useProfileStore()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || ''
  })
  const [formError, setFormError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear errors when user starts typing
    if (formError) setFormError(null)
    if (error) clearError()
    if (successMessage) setSuccessMessage(null)
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setFormError('Name is required')
      return false
    }
    
    if (!formData.email.trim()) {
      setFormError('Email is required')
      return false
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setFormError('Please enter a valid email address')
      return false
    }
    
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    try {
      // Only update fields that have changed
      const updatedFields: Record<string, string> = {}
      
      if (formData.name !== user?.name) updatedFields.name = formData.name
      if (formData.email !== user?.email) updatedFields.email = formData.email
      if (formData.avatar !== user?.avatar && formData.avatar) updatedFields.avatar = formData.avatar
      
      // Don't make API call if nothing changed
      if (Object.keys(updatedFields).length === 0) {
        setSuccessMessage('No changes to save')
        return
      }
      
      const updatedUser = await updateProfileInfo(updatedFields)
      
      // Update user in auth store if we got data back
      if (updatedUser && user) {
        setUser({ ...user, ...updatedUser })
      }
      
      setSuccessMessage('Profile updated successfully')
    } catch (err) {
      // Error will be set in the store
    }
  }

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <Button 
          variant="ghost" 
          className="mb-6 pl-0"
          onClick={() => navigate('/profile')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Profile
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {formError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}
            
            {successMessage && (
              <Alert className="mb-4 bg-green-50 text-green-700 border-green-200">
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your email address"
                />
                <p className="text-sm text-gray-500">
                  Changing your email may require verification
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="avatar">Profile Picture URL</Label>
                <Input
                  id="avatar"
                  name="avatar"
                  value={formData.avatar || ''}
                  onChange={handleChange}
                  placeholder="https://example.com/your-photo.jpg"
                />
                <p className="text-sm text-gray-500">
                  Enter the URL of your profile picture
                </p>
              </div>
              
              {formData.avatar && (
                <div className="rounded-lg overflow-hidden w-24 h-24 border">
                  <img 
                    src={formData.avatar} 
                    alt="Profile Preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = 'https://via.placeholder.com/150?text=Error'
                      setFormError('Invalid image URL')
                    }}
                  />
                </div>
              )}
              
              <CardFooter className="px-0 pt-4">
                <div className="flex justify-end gap-4 w-full">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/profile')}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </div>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 