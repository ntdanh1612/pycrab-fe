import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth.store'
import { useProfileStore } from '@/stores/profile.store'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertCircle, ArrowLeft, Bell, Globe, Loader2, Mail, Moon, Shield, Trash2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'

export default function AccountSettings() {
  const { user, logout } = useAuthStore()
  const { preferences, updatePreferences, deleteAccount, loading, error, clearError } = useProfileStore()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    emailNotifications: preferences?.emailNotifications ?? true,
    marketingEmails: preferences?.marketingEmails ?? false,
    orderUpdates: preferences?.orderUpdates ?? true,
    darkMode: preferences?.darkMode ?? false,
    language: preferences?.language ?? 'en',
  })
  
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteEmail, setDeleteEmail] = useState('')
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }))
    
    // Clear messages when settings are changed
    if (error) clearError()
    if (successMessage) setSuccessMessage(null)
    
    // Auto-save the setting
    handleSaveSetting(name, checked)
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear messages when settings are changed
    if (error) clearError()
    if (successMessage) setSuccessMessage(null)
    
    // Auto-save the setting
    handleSaveSetting(name, value)
  }

  const handleSaveSetting = async (name: string, value: any) => {
    try {
      await updatePreferences({ [name]: value })
      setSuccessMessage('Settings updated successfully')
      
      // Auto-clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)
    } catch (err) {
      // Error will be set in the store
    }
  }

  const handleSaveAllSettings = async () => {
    try {
      await updatePreferences(formData)
      setSuccessMessage('All settings updated successfully')
      
      // Auto-clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)
    } catch (err) {
      // Error will be set in the store
    }
  }

  const handleDeleteAccount = async () => {
    // Verify the email address
    if (!deleteEmail) {
      setDeleteError('Please enter your email address to confirm')
      return
    }
    
    if (deleteEmail !== user?.email) {
      setDeleteError('Email address does not match your account')
      return
    }
    
    // Clear any previous errors
    setDeleteError(null)
    
    try {
      await deleteAccount()
      
      // Logout after successful deletion
      await logout()
      
      // Redirect to home page
      navigate('/', { 
        replace: true,
        state: { message: 'Your account has been successfully deleted' } 
      })
    } catch (err) {
      // Error will be set in the store
    }
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          className="mb-6 pl-0"
          onClick={() => navigate('/profile')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Profile
        </Button>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
            <p className="text-gray-500 dark:text-gray-400">Manage your account preferences</p>
          </div>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {successMessage && (
          <Alert className="mb-6 bg-green-50 text-green-700 border-green-200">
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-6">
          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="emailNotifications"
                  checked={formData.emailNotifications}
                  onCheckedChange={(checked) => handleCheckboxChange('emailNotifications', !!checked)}
                />
                <div className="grid gap-1.5">
                  <Label htmlFor="emailNotifications" className="font-medium">
                    Email Notifications
                  </Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive notifications via email
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="marketingEmails"
                  checked={formData.marketingEmails}
                  onCheckedChange={(checked) => handleCheckboxChange('marketingEmails', !!checked)}
                />
                <div className="grid gap-1.5">
                  <Label htmlFor="marketingEmails" className="font-medium">
                    Marketing Emails
                  </Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive promotional emails and special offers
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="orderUpdates"
                  checked={formData.orderUpdates}
                  onCheckedChange={(checked) => handleCheckboxChange('orderUpdates', !!checked)}
                />
                <div className="grid gap-1.5">
                  <Label htmlFor="orderUpdates" className="font-medium">
                    Order Updates
                  </Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive updates about your orders and deliveries
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Moon className="mr-2 h-5 w-5" />
                Appearance Settings
              </CardTitle>
              <CardDescription>Customize your visual experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="darkMode"
                  checked={formData.darkMode}
                  onCheckedChange={(checked) => handleCheckboxChange('darkMode', !!checked)}
                />
                <div className="grid gap-1.5">
                  <Label htmlFor="darkMode" className="font-medium">
                    Dark Mode
                  </Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Use dark mode for the website interface
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Language Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="mr-2 h-5 w-5" />
                Language Settings
              </CardTitle>
              <CardDescription>Choose your preferred language</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">Preferred Language</Label>
                <Select 
                  value={formData.language} 
                  onValueChange={(value) => handleSelectChange('language', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="zh">简体中文</SelectItem>
                    <SelectItem value="ja">日本語</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={handleSaveAllSettings} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save All Settings
              </Button>
            </CardFooter>
          </Card>
          
          {/* Privacy & Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Privacy & Security
              </CardTitle>
              <CardDescription>Manage your account security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-1.5">
                <h3 className="text-base font-medium">Change Password</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Securely update your account password
                </p>
                <Button variant="outline" onClick={() => navigate('/forgot-password')}>
                  <Mail className="mr-2 h-4 w-4" />
                  Request Password Reset
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Account Deletion */}
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="flex items-center text-destructive">
                <Trash2 className="mr-2 h-5 w-5" />
                Delete Account
              </CardTitle>
              <CardDescription>
                Permanently delete your account and all associated data
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!showDeleteConfirm ? (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Deleting your account will remove all your personal information, orders, payment methods, and addresses from our system. This action cannot be undone.
                  </p>
                  <Button 
                    variant="destructive" 
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Account
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      This action is permanent and cannot be undone. All your data will be permanently deleted.
                    </AlertDescription>
                  </Alert>
                  
                  {deleteError && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{deleteError}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="deleteConfirmation">To confirm, please enter your email address: {user?.email}</Label>
                    <Input
                      id="deleteConfirmation"
                      placeholder="Enter your email address"
                      value={deleteEmail}
                      onChange={(e) => setDeleteEmail(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowDeleteConfirm(false)
                        setDeleteEmail('')
                        setDeleteError(null)
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      disabled={loading}
                    >
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Confirm Account Deletion
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 