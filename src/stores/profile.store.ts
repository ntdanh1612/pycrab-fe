import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
// import { apiService } from '@/services/api'
import type { User } from '@/types/auth'
import { generateMockData } from '@/data/mockProfileData'

export interface Address {
  id: string
  userId: string
  name: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface PaymentMethod {
  id: string
  userId: string
  type: 'card' | 'paypal' | 'applepay' | 'googlepay'
  lastFour?: string
  expiryDate?: string
  cardType?: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface Order {
  id: string
  userId: string
  orderNumber: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  total: number
  items: OrderItem[]
  shippingAddress: Address
  billingAddress: Address
  paymentMethod: PaymentMethod
  createdAt: string
  updatedAt: string
  trackingNumber?: string
  estimatedDelivery?: string
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  name: string
  price: number
  quantity: number
  imageUrl: string
  variant?: string
}

export interface Notification {
  id: string
  userId: string
  type: 'order' | 'account' | 'promotion' | 'system'
  title: string
  message: string
  isRead: boolean
  createdAt: string
  link?: string
}

export interface UserPreferences {
  emailNotifications: boolean
  marketingEmails: boolean
  orderUpdates: boolean
  darkMode: boolean
  language: string
}

interface ProfileState {
  addresses: Address[]
  paymentMethods: PaymentMethod[]
  orders: Order[]
  notifications: Notification[]
  preferences: UserPreferences
  loading: boolean
  error: string | null

  // Actions
  fetchAddresses: () => Promise<void>
  addAddress: (address: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateAddress: (id: string, address: Partial<Address>) => Promise<void>
  deleteAddress: (id: string) => Promise<void>
  setDefaultAddress: (id: string) => Promise<void>

  fetchPaymentMethods: () => Promise<void>
  addPaymentMethod: (paymentMethod: Omit<PaymentMethod, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updatePaymentMethod: (id: string, paymentMethod: Partial<PaymentMethod>) => Promise<void>
  deletePaymentMethod: (id: string) => Promise<void>
  setDefaultPaymentMethod: (id: string) => Promise<void>

  fetchOrders: () => Promise<void>
  fetchOrderDetails: (id: string) => Promise<Order | null>
  trackOrder: (id: string) => Promise<{ status: string; updates: any[] } | null>

  fetchNotifications: () => Promise<void>
  markNotificationAsRead: (id: string) => Promise<void>
  markAllNotificationsAsRead: () => Promise<void>
  deleteNotification: (id: string) => Promise<void>

  updateProfileInfo: (data: Partial<User>) => Promise<void>
  updatePreferences: (prefs: Partial<UserPreferences>) => Promise<void>
  deleteAccount: () => Promise<void>

  clearError: () => void
}

// Mock data
const mockData = generateMockData()

const initialState = {
  addresses: [],
  paymentMethods: [],
  orders: [],
  notifications: [],
  preferences: {
    emailNotifications: true,
    marketingEmails: false,
    orderUpdates: true,
    darkMode: false,
    language: 'en'
  },
  loading: false,
  error: null
}

export const useProfileStore = create<ProfileState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        fetchAddresses: async () => {
          set({ loading: true, error: null })
          try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500))
            set({ addresses: mockData.addresses, loading: false })
          } catch (error) {
            set({
              loading: false,
              error: error instanceof Error ? error.message : 'Failed to fetch addresses'
            })
          }
        },

        addAddress: async (address) => {
          set({ loading: true, error: null })
          try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500))
            const newAddress: Address = {
              id: `addr_${Date.now()}`,
              userId: 'user_1',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              ...address
            }
            set(state => ({
              addresses: [...state.addresses, newAddress],
              loading: false
            }))
          } catch (error) {
            set({
              loading: false,
              error: error instanceof Error ? error.message : 'Failed to add address'
            })
          }
        },

        updateAddress: async (id, address) => {
          set({ loading: true, error: null })
          try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500))
            set(state => ({
              addresses: state.addresses.map(addr => 
                addr.id === id ? { 
                  ...addr, 
                  ...address, 
                  updatedAt: new Date().toISOString() 
                } : addr
              ),
              loading: false
            }))
          } catch (error) {
            set({
              loading: false,
              error: error instanceof Error ? error.message : 'Failed to update address'
            })
          }
        },

        deleteAddress: async (id) => {
          set({ loading: true, error: null })
          try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500))
            set(state => ({
              addresses: state.addresses.filter(addr => addr.id !== id),
              loading: false
            }))
          } catch (error) {
            set({
              loading: false,
              error: error instanceof Error ? error.message : 'Failed to delete address'
            })
          }
        },

        setDefaultAddress: async (id) => {
          set({ loading: true, error: null })
          try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500))
            set(state => ({
              addresses: state.addresses.map(addr => ({
                ...addr,
                isDefault: addr.id === id,
                updatedAt: new Date().toISOString()
              })),
              loading: false
            }))
          } catch (error) {
            set({
              loading: false,
              error: error instanceof Error ? error.message : 'Failed to set default address'
            })
          }
        },

        fetchPaymentMethods: async () => {
          set({ loading: true, error: null })
          try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500))
            set({ paymentMethods: mockData.paymentMethods, loading: false })
          } catch (error) {
            set({
              loading: false,
              error: error instanceof Error ? error.message : 'Failed to fetch payment methods'
            })
          }
        },

        addPaymentMethod: async (paymentMethod) => {
          set({ loading: true, error: null })
          try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500))
            const newPaymentMethod: PaymentMethod = {
              id: `pm_${Date.now()}`,
              userId: 'user_1',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              ...paymentMethod
            }
            set(state => ({
              paymentMethods: [...state.paymentMethods, newPaymentMethod],
              loading: false
            }))
          } catch (error) {
            set({
              loading: false,
              error: error instanceof Error ? error.message : 'Failed to add payment method'
            })
          }
        },

        updatePaymentMethod: async (id, paymentMethod) => {
          set({ loading: true, error: null })
          try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500))
            set(state => ({
              paymentMethods: state.paymentMethods.map(pm => 
                pm.id === id ? { 
                  ...pm, 
                  ...paymentMethod, 
                  updatedAt: new Date().toISOString() 
                } : pm
              ),
              loading: false
            }))
          } catch (error) {
            set({
              loading: false,
              error: error instanceof Error ? error.message : 'Failed to update payment method'
            })
          }
        },

        deletePaymentMethod: async (id) => {
          set({ loading: true, error: null })
          try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500))
            set(state => ({
              paymentMethods: state.paymentMethods.filter(pm => pm.id !== id),
              loading: false
            }))
          } catch (error) {
            set({
              loading: false,
              error: error instanceof Error ? error.message : 'Failed to delete payment method'
            })
          }
        },

        setDefaultPaymentMethod: async (id) => {
          set({ loading: true, error: null })
          try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500))
            set(state => ({
              paymentMethods: state.paymentMethods.map(pm => ({
                ...pm,
                isDefault: pm.id === id,
                updatedAt: new Date().toISOString()
              })),
              loading: false
            }))
          } catch (error) {
            set({
              loading: false,
              error: error instanceof Error ? error.message : 'Failed to set default payment method'
            })
          }
        },

        fetchOrders: async () => {
          set({ loading: true, error: null })
          try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500))
            set({ orders: mockData.orders, loading: false })
          } catch (error) {
            set({
              loading: false,
              error: error instanceof Error ? error.message : 'Failed to fetch orders'
            })
          }
        },

        fetchOrderDetails: async (id) => {
          set({ loading: true, error: null })
          try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500))
            const order = mockData.orders.find(order => order.id === id) || null
            set({ loading: false })
            return order
          } catch (error) {
            set({
              loading: false,
              error: error instanceof Error ? error.message : 'Failed to fetch order details'
            })
            return null
          }
        },

        trackOrder: async (id) => {
          set({ loading: true, error: null })
          try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500))
            const order = mockData.orders.find(order => order.id === id)
            if (!order) {
              throw new Error('Order not found')
            }
            
            const mockTracking = {
              status: order.status,
              updates: [
                {
                  status: 'order_placed',
                  timestamp: order.createdAt,
                  message: 'Order placed successfully'
                },
                {
                  status: 'processing',
                  timestamp: new Date(new Date(order.createdAt).getTime() + 24 * 60 * 60 * 1000).toISOString(),
                  message: 'Order is being processed'
                }
              ]
            }
            
            if (['shipped', 'delivered'].includes(order.status)) {
              mockTracking.updates.push({
                status: 'shipped',
                timestamp: new Date(new Date(order.createdAt).getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
                message: 'Order has been shipped'
              })
            }
            
            if (order.status === 'delivered') {
              mockTracking.updates.push({
                status: 'delivered',
                timestamp: new Date(new Date(order.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                message: 'Order has been delivered'
              })
            }
            
            set({ loading: false })
            return mockTracking
          } catch (error) {
            set({
              loading: false,
              error: error instanceof Error ? error.message : 'Failed to track order'
            })
            return null
          }
        },

        fetchNotifications: async () => {
          set({ loading: true, error: null })
          try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500))
            set({ notifications: mockData.notifications, loading: false })
          } catch (error) {
            set({
              loading: false,
              error: error instanceof Error ? error.message : 'Failed to fetch notifications'
            })
          }
        },

        markNotificationAsRead: async (id) => {
          set({ loading: true, error: null })
          try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500))
            set(state => ({
              notifications: state.notifications.map(n => 
                n.id === id ? { ...n, isRead: true } : n
              ),
              loading: false
            }))
          } catch (error) {
            set({
              loading: false,
              error: error instanceof Error ? error.message : 'Failed to mark notification as read'
            })
          }
        },

        markAllNotificationsAsRead: async () => {
          set({ loading: true, error: null })
          try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500))
            set(state => ({
              notifications: state.notifications.map(n => ({ ...n, isRead: true })),
              loading: false
            }))
          } catch (error) {
            set({
              loading: false,
              error: error instanceof Error ? error.message : 'Failed to mark all notifications as read'
            })
          }
        },

        deleteNotification: async (id) => {
          set({ loading: true, error: null })
          try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500))
            set(state => ({
              notifications: state.notifications.filter(n => n.id !== id),
              loading: false
            }))
          } catch (error) {
            set({
              loading: false,
              error: error instanceof Error ? error.message : 'Failed to delete notification'
            })
          }
        },

        updateProfileInfo: async (data) => {
          set({ loading: true, error: null })
          try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500))
            set({ loading: false })
            // Return the updated data to update auth store
            return data
          } catch (error) {
            set({
              loading: false,
              error: error instanceof Error ? error.message : 'Failed to update profile'
            })
            throw error
          }
        },

        updatePreferences: async (prefs) => {
          set({ loading: true, error: null })
          try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500))
            set(state => ({
              preferences: { ...state.preferences, ...prefs },
              loading: false
            }))
          } catch (error) {
            set({
              loading: false,
              error: error instanceof Error ? error.message : 'Failed to update preferences'
            })
          }
        },

        deleteAccount: async () => {
          set({ loading: true, error: null })
          try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500))
            set({ loading: false })
            // Account deletion successful
          } catch (error) {
            set({
              loading: false,
              error: error instanceof Error ? error.message : 'Failed to delete account'
            })
            throw error
          }
        },

        clearError: () => set({ error: null })
      }),
      {
        name: 'profile-storage',
        partialize: (state) => ({
          preferences: state.preferences
        })
      }
    )
  )
) 