import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useProfileStore } from '@/stores/profile.store'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle, ArrowLeft, Bell, Check, Clock, Loader2, Package, ShoppingBag, Trash, Trash2, User } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import type { Notification } from '@/stores/profile.store'

export default function Notifications() {
  const { notifications, loading, error, fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } = useProfileStore()
  const navigate = useNavigate()
  
  const [activeTab, setActiveTab] = useState('all')
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([])
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [processedNotificationIds, setProcessedNotificationIds] = useState<Record<string, boolean>>({})

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  // Filter notifications when active tab changes
  useEffect(() => {
    if (!notifications.length) {
      setFilteredNotifications([])
      return
    }
    
    let result = [...notifications]
    
    // Filter by tab
    if (activeTab === 'unread') {
      result = result.filter(notification => !notification.isRead)
    }
    
    // Sort by date (newest first)
    result.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    
    setFilteredNotifications(result)
  }, [notifications, activeTab])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const handleMarkAsRead = async (id: string) => {
    if (processedNotificationIds[id]) return
    
    try {
      setProcessedNotificationIds(prev => ({ ...prev, [id]: true }))
      await markNotificationAsRead(id)
      setSuccessMessage('Notification marked as read')
      
      // Auto-clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)
    } catch (err) {
      // Error will be set in store
    } finally {
      setProcessedNotificationIds(prev => ({ ...prev, [id]: false }))
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead()
      setSuccessMessage('All notifications marked as read')
      
      // Auto-clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)
    } catch (err) {
      // Error will be set in store
    }
  }

  const handleDeleteNotification = async (id: string) => {
    if (processedNotificationIds[id]) return
    
    try {
      setProcessedNotificationIds(prev => ({ ...prev, [id]: true }))
      await deleteNotification(id)
      setSuccessMessage('Notification deleted')
      
      // Auto-clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)
    } catch (err) {
      // Error will be set in store
    }
  }

  // Get counts for tabs
  const getNotificationCounts = () => {
    return {
      all: notifications.length,
      unread: notifications.filter(n => !n.isRead).length
    }
  }

  // Format date to relative time (e.g., "2 hours ago")
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    
    const diffSecs = Math.floor(diffMs / 1000)
    const diffMins = Math.floor(diffSecs / 60)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)
    
    if (diffSecs < 60) {
      return 'just now'
    } else if (diffMins < 60) {
      return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`
    } else {
      return date.toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    }
  }

  // Get appropriate icon for notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <Package className="h-5 w-5" />
      case 'account':
        return <User className="h-5 w-5" />
      case 'promotion':
        return <ShoppingBag className="h-5 w-5" />
      case 'system':
        return <Bell className="h-5 w-5" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  // Get appropriate background color for notification type
  const getTypeColors = (type: string) => {
    switch (type) {
      case 'order':
        return 'bg-blue-50 text-blue-700 border-blue-100'
      case 'account':
        return 'bg-green-50 text-green-700 border-green-100'
      case 'promotion':
        return 'bg-purple-50 text-purple-700 border-purple-100'
      case 'system':
        return 'bg-yellow-50 text-yellow-700 border-yellow-100'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-100'
    }
  }

  const notificationCounts = getNotificationCounts()

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
            <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
            <p className="text-gray-500 dark:text-gray-400">Stay updated on your account activity</p>
          </div>
          {notificationCounts.unread > 0 && (
            <Button onClick={handleMarkAllAsRead} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Mark All as Read
            </Button>
          )}
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
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid grid-cols-2 w-full mb-6">
            <TabsTrigger value="all">
              All Notifications
              <Badge variant="outline" className="ml-1">{notificationCounts.all}</Badge>
            </TabsTrigger>
            <TabsTrigger value="unread">
              Unread
              <Badge variant="outline" className="ml-1">{notificationCounts.unread}</Badge>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {renderNotificationList(filteredNotifications, loading)}
          </TabsContent>
          
          <TabsContent value="unread">
            {renderNotificationList(filteredNotifications, loading)}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )

  // Helper function to render notification list with loading states
  function renderNotificationList(notifications: Notification[], isLoading: boolean) {
    if (isLoading && !notifications.length) {
      return (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="flex">
                  <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 mr-2"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      )
    }
    
    if (!notifications.length) {
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-6">
              <Bell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No Notifications</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                You don't have any{activeTab === 'unread' ? ' unread' : ''} notifications at this time.
              </p>
              {activeTab === 'unread' && notificationCounts.all > 0 && (
                <Button onClick={() => setActiveTab('all')}>
                  View All Notifications
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )
    }
    
    return (
      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card key={notification.id} className={notification.isRead ? '' : 'bg-primary-50 dark:bg-primary-900/10'}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <div className={`rounded-full p-2 mr-3 ${getTypeColors(notification.type)}`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div>
                    <CardTitle className="text-base font-medium flex items-center">
                      {notification.title}
                      {!notification.isRead && (
                        <Badge variant="default" className="ml-2">New</Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {formatRelativeTime(notification.createdAt)}
                    </CardDescription>
                  </div>
                </div>
                
                <div className="flex space-x-1">
                  {!notification.isRead && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleMarkAsRead(notification.id)}
                      disabled={processedNotificationIds[notification.id]}
                    >
                      {processedNotificationIds[notification.id] ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                      <span className="sr-only">Mark as read</span>
                    </Button>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleDeleteNotification(notification.id)}
                    disabled={processedNotificationIds[notification.id]}
                  >
                    {processedNotificationIds[notification.id] ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash className="h-4 w-4" />
                    )}
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{notification.message}</p>
              
              {notification.link && (
                <div className="mt-3">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={notification.link}>View Details</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }
} 