import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { Product } from '@/components/ui/product-card'

export interface CartItem extends Product {
  quantity: number
  selectedVariant?: {
    color?: string
    size?: string
    style?: string
  }
}

interface CartState {
  items: CartItem[]
  addItem: (item: Product, quantity?: number, selectedVariant?: CartItem['selectedVariant']) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  updateVariant: (itemId: string, variant: CartItem['selectedVariant']) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  isInCart: (itemId: string) => boolean
}

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set, get) => ({
        items: [],
        addItem: (item, quantity = 1, selectedVariant) => {
          const currentItems = get().items
          const existingItemIndex = currentItems.findIndex((i) => i.id === item.id)

          if (existingItemIndex > -1) {
            // If item exists, update quantity
            const updatedItems = [...currentItems]
            updatedItems[existingItemIndex].quantity += quantity
            set({ items: updatedItems })
          } else {
            // Add new item
            set({ items: [...currentItems, { ...item, quantity, selectedVariant }] })
          }
        },
        removeItem: (itemId) => {
          set({ items: get().items.filter((item) => item.id !== itemId) })
        },
        updateQuantity: (itemId, quantity) => {
          if (quantity <= 0) {
            get().removeItem(itemId)
            return
          }
          set({
            items: get().items.map((item) =>
              item.id === itemId ? { ...item, quantity } : item
            ),
          })
        },
        updateVariant: (itemId, variant) => {
          set({
            items: get().items.map((item) =>
              item.id === itemId ? { ...item, selectedVariant: variant } : item
            ),
          })
        },
        clearCart: () => {
          set({ items: [] })
        },
        getTotalItems: () => {
          return get().items.reduce((total, item) => total + item.quantity, 0)
        },
        getTotalPrice: () => {
          return get().items.reduce((total, item) => {
            const price = item.discount
              ? item.price * (1 - item.discount / 100)
              : item.price
            return total + price * item.quantity
          }, 0)
        },
        isInCart: (itemId) => {
          return get().items.some((item) => item.id === itemId)
        },
      }),
      {
        name: 'cart-storage',
      }
    )
  )
) 