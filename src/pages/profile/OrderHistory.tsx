import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useProfileStore } from '@/stores/profile.store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle, ArrowLeft, Check, Clock, Download, Eye, Filter, Loader2, Package, Search, ShoppingBag, Truck, X } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import type { Order } from '@/stores/profile.store'

// Status color mapping
const getStatusColors = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-50 text-yellow-700 border-yellow-200'
    case 'processing':
      return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'shipped':
      return 'bg-purple-50 text-purple-700 border-purple-200'
    case 'delivered':
      return 'bg-green-50 text-green-700 border-green-200'
    case 'cancelled':
      return 'bg-red-50 text-red-700 border-red-200'
    case 'refunded':
      return 'bg-gray-50 text-gray-700 border-gray-200'
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200'
  }
}

// Status icon mapping
const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <Clock className="h-4 w-4" />
    case 'processing':
      return <Package className="h-4 w-4" />
    case 'shipped':
      return <Truck className="h-4 w-4" />
    case 'delivered':
      return <Check className="h-4 w-4" />
    case 'cancelled':
      return <X className="h-4 w-4" />
    case 'refunded':
      return <ShoppingBag className="h-4 w-4" />
    default:
      return <Package className="h-4 w-4" />
  }
}

// Initial filter state
const initialFilterState = {
  status: 'all',
  dateRange: 'all',
  search: '',
}

export default function OrderHistory() {
  const { orders, loading, error, fetchOrders } = useProfileStore()
  const navigate = useNavigate()
  
  const [activeTab, setActiveTab] = useState('all')
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [filters, setFilters] = useState(initialFilterState)
  const [showFilters, setShowFilters] = useState(false)

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  // Filter orders when filters or orders change
  useEffect(() => {
    if (!orders.length) {
      setFilteredOrders([])
      return
    }
    
    let result = [...orders]
    
    // Filter by tab (status group)
    if (activeTab !== 'all') {
      if (activeTab === 'active') {
        result = result.filter(order => 
          ['pending', 'processing', 'shipped'].includes(order.status)
        )
      } else if (activeTab === 'completed') {
        result = result.filter(order => 
          ['delivered'].includes(order.status)
        )
      } else if (activeTab === 'cancelled') {
        result = result.filter(order => 
          ['cancelled', 'refunded'].includes(order.status)
        )
      }
    }
    
    // Apply additional filters
    if (filters.status !== 'all') {
      result = result.filter(order => order.status === filters.status)
    }
    
    if (filters.dateRange !== 'all') {
      const now = new Date()
      const cutoffDate = new Date()
      
      switch (filters.dateRange) {
        case '30days':
          cutoffDate.setDate(now.getDate() - 30)
          break
        case '6months':
          cutoffDate.setMonth(now.getMonth() - 6)
          break
        case '1year':
          cutoffDate.setFullYear(now.getFullYear() - 1)
          break
      }
      
      result = result.filter(order => new Date(order.createdAt) >= cutoffDate)
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(order => 
        order.orderNumber.toLowerCase().includes(searchLower) ||
        order.items.some(item => item.name.toLowerCase().includes(searchLower))
      )
    }
    
    // Sort by date (newest first)
    result.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    
    setFilteredOrders(result)
  }, [orders, activeTab, filters])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  const resetFilters = () => {
    setFilters(initialFilterState)
    setShowFilters(false)
  }

  // Count orders by status
  const getStatusCounts = () => {
    const counts = {
      all: orders.length,
      active: orders.filter(order => 
        ['pending', 'processing', 'shipped'].includes(order.status)
      ).length,
      completed: orders.filter(order => order.status === 'delivered').length,
      cancelled: orders.filter(order => 
        ['cancelled', 'refunded'].includes(order.status)
      ).length,
    }
    
    return counts
  }

  // Format date to locale string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const statusCounts = getStatusCounts()

  return (
    <div className="container py-8">
      <div className="max-w-5xl mx-auto">
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
            <h1 className="text-2xl font-bold tracking-tight">Order History</h1>
            <p className="text-gray-500 dark:text-gray-400">View and track your past orders</p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant={showFilters ? 'default' : 'outline'} 
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
            <Button variant="outline" onClick={() => navigate('/profile/orders/track')}>
              <Truck className="mr-2 h-4 w-4" />
              Track Orders
            </Button>
          </div>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {/* Order filter toolbar */}
        {showFilters && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Order Status</Label>
                    <Select 
                      value={filters.status} 
                      onValueChange={(value) => handleFilterChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="refunded">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dateRange">Date Range</Label>
                    <Select 
                      value={filters.dateRange} 
                      onValueChange={(value) => handleFilterChange('dateRange', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select date range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="30days">Last 30 Days</SelectItem>
                        <SelectItem value="6months">Last 6 Months</SelectItem>
                        <SelectItem value="1year">Last Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="search">Search Orders</Label>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        id="search"
                        placeholder="Order # or product name"
                        className="pl-8"
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button variant="ghost" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="all" className="relative">
              All Orders
              <Badge variant="outline" className="ml-1">{statusCounts.all}</Badge>
            </TabsTrigger>
            <TabsTrigger value="active">
              Active
              <Badge variant="outline" className="ml-1">{statusCounts.active}</Badge>
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed
              <Badge variant="outline" className="ml-1">{statusCounts.completed}</Badge>
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Cancelled
              <Badge variant="outline" className="ml-1">{statusCounts.cancelled}</Badge>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            {renderOrderList(filteredOrders, loading)}
          </TabsContent>
          
          <TabsContent value="active" className="mt-6">
            {renderOrderList(filteredOrders, loading)}
          </TabsContent>
          
          <TabsContent value="completed" className="mt-6">
            {renderOrderList(filteredOrders, loading)}
          </TabsContent>
          
          <TabsContent value="cancelled" className="mt-6">
            {renderOrderList(filteredOrders, loading)}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )

  // Helper function to render the order list with loading states
  function renderOrderList(orders: Order[], isLoading: boolean) {
    if (isLoading && !orders.length) {
      return (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <div className="space-y-2">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                  </div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/5"></div>
                  </div>
                  <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="flex justify-end">
                    <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )
    }
    
    if (!orders.length) {
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-6">
              <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No Orders Found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {filters.search || filters.status !== 'all' || filters.dateRange !== 'all'
                  ? 'No orders match your current filters. Try adjusting your search criteria.'
                  : "You haven't placed any orders yet."
                }
              </p>
              <div className="flex justify-center gap-3">
                {(filters.search || filters.status !== 'all' || filters.dateRange !== 'all') && (
                  <Button onClick={resetFilters}>
                    Clear Filters
                  </Button>
                )}
                <Button variant="outline" onClick={() => navigate('/products')}>
                  Browse Products
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )
    }
    
    return (
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                <div>
                  <CardTitle className="text-base font-medium">
                    Order #{order.orderNumber}
                  </CardTitle>
                  <CardDescription>
                    Placed on {formatDate(order.createdAt)}
                  </CardDescription>
                </div>
                <div className={`inline-flex items-center mt-2 sm:mt-0 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColors(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="ml-1.5 capitalize">{order.status}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between text-sm">
                  <div className="space-y-1">
                    <div className="text-gray-500 dark:text-gray-400">Items</div>
                    <div className="font-medium">{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</div>
                  </div>
                  
                  <div className="space-y-1 mt-2 sm:mt-0">
                    <div className="text-gray-500 dark:text-gray-400">Total</div>
                    <div className="font-medium">${order.total.toFixed(2)}</div>
                  </div>
                  
                  {order.trackingNumber && (
                    <div className="space-y-1 mt-2 sm:mt-0">
                      <div className="text-gray-500 dark:text-gray-400">Tracking</div>
                      <div className="font-medium">#{order.trackingNumber}</div>
                    </div>
                  )}
                  
                  {order.estimatedDelivery && (
                    <div className="space-y-1 mt-2 sm:mt-0">
                      <div className="text-gray-500 dark:text-gray-400">Est. Delivery</div>
                      <div className="font-medium">{formatDate(order.estimatedDelivery)}</div>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {order.items.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded border overflow-hidden flex-shrink-0">
                        <img 
                          src={item.imageUrl} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = 'https://via.placeholder.com/150?text=Product'
                          }}
                        />
                      </div>
                      <div className="flex-grow">
                        <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span>Qty: {item.quantity}</span>
                          <span>${item.price.toFixed(2)}</span>
                        </div>
                        {item.variant && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Variant: {item.variant}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {order.items.length > 3 && (
                    <div className="flex items-center justify-center md:justify-start">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        +{order.items.length - 3} more items
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end gap-3">
                  {['pending', 'processing', 'shipped'].includes(order.status) && (
                    <Button variant="outline" asChild size="sm">
                      <Link to={`/profile/orders/track?id=${order.id}`}>
                        <Truck className="mr-2 h-4 w-4" />
                        Track Order
                      </Link>
                    </Button>
                  )}
                  
                  {order.status === 'delivered' && (
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Invoice
                    </Button>
                  )}
                  
                  <Button asChild size="sm">
                    <Link to={`/profile/orders/${order.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }
} 