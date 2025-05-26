import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth.store'
import { useProfileStore } from '@/stores/profile.store'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Clock, CreditCard, Edit, Home, MapPin, Package, Settings, ShoppingBag, User } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function ProfileDashboard() {
  const { user } = useAuthStore()
  const { orders, notifications, addresses, paymentMethods, loading, error, 
    fetchOrders, fetchNotifications, fetchAddresses, fetchPaymentMethods } = useProfileStore()
  const navigate = useNavigate()
  const [loadingStatus, setLoadingStatus] = useState<{ [key: string]: boolean }>({
    orders: false,
    notifications: false,
    addresses: false,
    payments: false
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingStatus(prev => ({ ...prev, orders: true }))
        await fetchOrders()
        setLoadingStatus(prev => ({ ...prev, orders: false }))
      } catch (error) {
        setLoadingStatus(prev => ({ ...prev, orders: false }))
      }
      
      try {
        setLoadingStatus(prev => ({ ...prev, notifications: true }))
        await fetchNotifications()
        setLoadingStatus(prev => ({ ...prev, notifications: false }))
      } catch (error) {
        setLoadingStatus(prev => ({ ...prev, notifications: false }))
      }
      
      try {
        setLoadingStatus(prev => ({ ...prev, addresses: true }))
        await fetchAddresses()
        setLoadingStatus(prev => ({ ...prev, addresses: false }))
      } catch (error) {
        setLoadingStatus(prev => ({ ...prev, addresses: false }))
      }
      
      try {
        setLoadingStatus(prev => ({ ...prev, payments: true }))
        await fetchPaymentMethods()
        setLoadingStatus(prev => ({ ...prev, payments: false }))
      } catch (error) {
        setLoadingStatus(prev => ({ ...prev, payments: false }))
      }
    }
    
    loadData()
  }, [fetchOrders, fetchNotifications, fetchAddresses, fetchPaymentMethods])

  const getRecentOrders = () => {
    return orders.slice(0, 3)
  }

  const getUnreadNotifications = () => {
    return notifications.filter(notification => !notification.isRead).slice(0, 3)
  }

  const getPendingOrders = () => {
    return orders.filter(order => ['pending', 'processing', 'shipped'].includes(order.status)).length
  }

  const getDefaultAddress = () => {
    return addresses.find(address => address.isDefault)
  }

  const getDefaultPaymentMethod = () => {
    return paymentMethods.find(pm => pm.isDefault)
  }

  if (error) {
    return (
      <div className="container py-10">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 flex flex-col items-center">
      <div className="container mx-auto px-4 sm:px-6 space-y-8 max-w-5xl w-full">
        <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border border-white/20 dark:border-gray-700/20 rounded-xl p-6 shadow-xl transition-all duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Account Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-300">Welcome back, {user?.name || 'Guest'}</p>
            </div>
            <Button onClick={() => navigate('/profile/settings')} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 dark:from-indigo-500 dark:to-purple-500 shadow-md hover:shadow-lg transition-all duration-300">
              <Settings className="mr-2 h-4 w-4" />
              Account Settings
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full">
          <Card className="backdrop-blur-xl bg-white/60 dark:bg-gray-900/60 border border-white/20 dark:border-gray-800/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400">
                <User className="mr-2 h-4 w-4 text-indigo-600 dark:text-indigo-400" /> 
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-1.5">
                <p className="text-sm font-medium">Name: {user?.name}</p>
                <p className="text-sm font-medium">Email: {user?.email}</p>
                <p className="text-sm font-medium">
                  Member since: {new Date(user?.createdAt || '').toLocaleDateString()}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" asChild className="w-full border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors duration-300">
                <Link to="/profile/edit">
                  <Edit className="mr-2 h-4 w-4 text-indigo-600 dark:text-indigo-400" /> 
                  Edit Profile
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="backdrop-blur-xl bg-white/60 dark:bg-gray-900/60 border border-white/20 dark:border-gray-800/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-600 dark:from-sky-400 dark:to-blue-400">
                <Home className="mr-2 h-4 w-4 text-sky-600 dark:text-sky-400" /> 
                Default Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              {loadingStatus.addresses ? (
                <div className="space-y-1.5 animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              ) : getDefaultAddress() ? (
                <div className="space-y-1.5">
                  <p className="text-sm font-medium">{getDefaultAddress()?.name}</p>
                  <p className="text-sm">{getDefaultAddress()?.addressLine1}</p>
                  {getDefaultAddress()?.addressLine2 && <p className="text-sm">{getDefaultAddress()?.addressLine2}</p>}
                  <p className="text-sm">
                    {getDefaultAddress()?.city}, {getDefaultAddress()?.state} {getDefaultAddress()?.postalCode}
                  </p>
                  <p className="text-sm">{getDefaultAddress()?.country}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">No address added yet</p>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" asChild className="w-full border-sky-200 dark:border-sky-800 hover:bg-sky-100 dark:hover:bg-sky-900/50 transition-colors duration-300">
                <Link to="/profile/addresses">
                  <MapPin className="mr-2 h-4 w-4 text-sky-600 dark:text-sky-400" /> 
                  Manage Addresses
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="backdrop-blur-xl bg-white/60 dark:bg-gray-900/60 border border-white/20 dark:border-gray-800/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
                <CreditCard className="mr-2 h-4 w-4 text-purple-600 dark:text-purple-400" /> 
                Default Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              {loadingStatus.payments ? (
                <div className="space-y-1.5 animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              ) : getDefaultPaymentMethod() ? (
                <div className="space-y-1.5">
                  <p className="text-sm font-medium capitalize">
                    {getDefaultPaymentMethod()?.type}
                    {getDefaultPaymentMethod()?.type === 'card' && getDefaultPaymentMethod()?.cardType && 
                      ` - ${getDefaultPaymentMethod()?.cardType}`}
                  </p>
                  {getDefaultPaymentMethod()?.lastFour && (
                    <p className="text-sm">
                      •••• •••• •••• {getDefaultPaymentMethod()?.lastFour}
                      {getDefaultPaymentMethod()?.expiryDate && 
                        ` (Expires: ${getDefaultPaymentMethod()?.expiryDate})`}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">No payment method added yet</p>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" asChild className="w-full border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors duration-300">
                <Link to="/profile/payment-methods">
                  <CreditCard className="mr-2 h-4 w-4 text-purple-600 dark:text-purple-400" /> 
                  Manage Payment Methods
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <Card className="md:col-span-2 backdrop-blur-xl bg-white/60 dark:bg-gray-900/60 border border-white/20 dark:border-gray-800/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-foreground">Recent Orders</CardTitle>
                <Button variant="outline" size="sm" asChild className="border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800/70 transition-colors duration-300">
                  <Link to="/profile/orders">View All Orders</Link>
                </Button>
              </div>
              <CardDescription>Track, manage and review your recent purchases</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingStatus.orders ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex justify-between animate-pulse">
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-4">
                  {getRecentOrders().map((order) => (
                    <div key={order.id} className="flex flex-col sm:flex-row justify-between gap-2 sm:items-center bg-white/80 dark:bg-gray-800/40 p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                      <div>
                        <p className="text-sm font-medium">Order #{order.orderNumber}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Placed on {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <div className="flex items-center mt-1">
                          <Badge variant={
                            order.status === 'delivered' ? 'default' :
                            order.status === 'cancelled' || order.status === 'refunded' ? 'destructive' :
                            'secondary'
                          } className={
                            order.status === 'delivered' ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-sm' :
                            order.status === 'cancelled' || order.status === 'refunded' ? 'bg-gradient-to-r from-red-500 to-pink-500 shadow-sm' :
                            'bg-gradient-to-r from-blue-500 to-indigo-500 shadow-sm'
                          }>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex flex-col sm:items-end">
                        <p className="text-sm font-medium">${order.total.toFixed(2)}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                        </p>
                        <Button variant="ghost" size="sm" asChild className="p-0 h-auto mt-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-300">
                          <Link to={`/profile/orders/${order.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">You haven't placed any orders yet</p>
              )}
            </CardContent>
            <CardFooter className="flex justify-between border-t border-gray-200/50 dark:border-gray-700/50 pt-6">
              <div className="flex items-center">
                <Package className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {getPendingOrders()} {getPendingOrders() === 1 ? 'order' : 'orders'} in progress
                </span>
              </div>
              <Button variant="ghost" size="sm" asChild className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-300">
                <Link to="/profile/orders/track">
                  Track Shipments
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="backdrop-blur-xl bg-white/60 dark:bg-gray-900/60 border border-white/20 dark:border-gray-800/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-foreground">Notifications</CardTitle>
                <Button variant="outline" size="sm" asChild className="border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800/70 transition-colors duration-300">
                  <Link to="/profile/notifications">View All</Link>
                </Button>
              </div>
              <CardDescription>Stay updated on your account activity</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingStatus.notifications ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    </div>
                  ))}
                </div>
              ) : getUnreadNotifications().length > 0 ? (
                <div className="space-y-4">
                  {getUnreadNotifications().map((notification) => (
                    <div key={notification.id} className="flex items-start gap-3 bg-white/80 dark:bg-gray-800/40 p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                      <div className={`mt-0.5 rounded-full p-1.5 shadow-md ${
                        notification.type === 'order' ? 'bg-gradient-to-br from-blue-400 to-blue-600 text-white' : 
                        notification.type === 'account' ? 'bg-gradient-to-br from-green-400 to-green-600 text-white' :
                        notification.type === 'promotion' ? 'bg-gradient-to-br from-purple-400 to-purple-600 text-white' :
                        'bg-gradient-to-br from-gray-400 to-gray-600 text-white'
                      }`}>
                        {notification.type === 'order' ? <Package className="h-3.5 w-3.5" /> :
                         notification.type === 'account' ? <User className="h-3.5 w-3.5" /> :
                         notification.type === 'promotion' ? <ShoppingBag className="h-3.5 w-3.5" /> :
                         <Clock className="h-3.5 w-3.5" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{notification.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{notification.message}</p>
                        {notification.link && (
                          <Link to={notification.link} className="text-xs text-blue-600 hover:underline transition-colors duration-300">
                            View Details
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No new notifications</p>
              )}
            </CardContent>
            <CardFooter className="border-t border-gray-200/50 dark:border-gray-700/50 pt-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {notifications.filter(n => !n.isRead).length} unread {notifications.filter(n => !n.isRead).length === 1 ? 'notification' : 'notifications'}
              </p>
            </CardFooter>
          </Card>
        </div>

        <div className="backdrop-blur-xl bg-white/60 dark:bg-gray-900/60 border border-white/20 dark:border-gray-800/50 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl p-6 w-full">
          <h2 className="text-xl font-bold tracking-tight mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Account Management</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 justify-items-center">
            <Button variant="outline" className="h-auto py-6 w-full sm:max-w-44 flex flex-col items-center justify-center gap-2 bg-white/70 dark:bg-gray-800/70 border border-white/30 dark:border-gray-700/30 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-blue-50 dark:hover:from-indigo-900/30 dark:hover:to-blue-900/30 transition-all duration-300 shadow-sm hover:shadow-md" asChild>
              <Link to="/profile/edit">
                <User className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                <span>Edit Profile</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-6 w-full sm:max-w-44 flex flex-col items-center justify-center gap-2 bg-white/70 dark:bg-gray-800/70 border border-white/30 dark:border-gray-700/30 hover:bg-gradient-to-br hover:from-sky-50 hover:to-indigo-50 dark:hover:from-sky-900/30 dark:hover:to-indigo-900/30 transition-all duration-300 shadow-sm hover:shadow-md" asChild>
              <Link to="/profile/addresses">
                <MapPin className="h-6 w-6 text-sky-600 dark:text-sky-400" />
                <span>Address Book</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-6 w-full sm:max-w-44 flex flex-col items-center justify-center gap-2 bg-white/70 dark:bg-gray-800/70 border border-white/30 dark:border-gray-700/30 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 transition-all duration-300 shadow-sm hover:shadow-md" asChild>
              <Link to="/profile/payment-methods">
                <CreditCard className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                <span>Payment Methods</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-6 w-full sm:max-w-44 flex flex-col items-center justify-center gap-2 bg-white/70 dark:bg-gray-800/70 border border-white/30 dark:border-gray-700/30 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 transition-all duration-300 shadow-sm hover:shadow-md" asChild>
              <Link to="/profile/orders">
                <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <span>Order History</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-6 w-full sm:max-w-44 flex flex-col items-center justify-center gap-2 bg-white/70 dark:bg-gray-800/70 border border-white/30 dark:border-gray-700/30 hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 dark:hover:from-green-900/30 dark:hover:to-emerald-900/30 transition-all duration-300 shadow-sm hover:shadow-md" asChild>
              <Link to="/profile/orders/track">
                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                <span>Track Orders</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-6 w-full sm:max-w-44 flex flex-col items-center justify-center gap-2 bg-white/70 dark:bg-gray-800/70 border border-white/30 dark:border-gray-700/30 hover:bg-gradient-to-br hover:from-orange-50 hover:to-amber-50 dark:hover:from-orange-900/30 dark:hover:to-amber-900/30 transition-all duration-300 shadow-sm hover:shadow-md" asChild>
              <Link to="/wishlist">
                <ShoppingBag className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                <span>Wishlist</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-6 w-full sm:max-w-44 flex flex-col items-center justify-center gap-2 bg-white/70 dark:bg-gray-800/70 border border-white/30 dark:border-gray-700/30 hover:bg-gradient-to-br hover:from-pink-50 hover:to-rose-50 dark:hover:from-pink-900/30 dark:hover:to-rose-900/30 transition-all duration-300 shadow-sm hover:shadow-md" asChild>
              <Link to="/profile/notifications">
                <Clock className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                <span>Notifications</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-6 w-full sm:max-w-44 flex flex-col items-center justify-center gap-2 bg-white/70 dark:bg-gray-800/70 border border-white/30 dark:border-gray-700/30 hover:bg-gradient-to-br hover:from-violet-50 hover:to-purple-50 dark:hover:from-violet-900/30 dark:hover:to-purple-900/30 transition-all duration-300 shadow-sm hover:shadow-md" asChild>
              <Link to="/profile/settings">
                <Settings className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                <span>Account Settings</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 