import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { Product } from '@/components/ui/product-card'

interface WishlistState {
  items: Product[]
  addItem: (item: Product) => void
  removeItem: (itemId: string) => void
  toggleItem: (item: Product) => void
  clearWishlist: () => void
  isInWishlist: (itemId: string) => boolean
}

export const useWishlistStore = create<WishlistState>()(
  devtools(
    persist(
      (set, get) => ({
        items: [],
        addItem: (item) => {
          const currentItems = get().items
          const exists = currentItems.some((i) => i.id === item.id)
          if (!exists) {
            set({ items: [...currentItems, item] })
          }
        },
        removeItem: (itemId) => {
          set({ items: get().items.filter((item) => item.id !== itemId) })
        },
        toggleItem: (item) => {
          const isInWishlist = get().isInWishlist(item.id)
          if (isInWishlist) {
            get().removeItem(item.id)
          } else {
            get().addItem(item)
          }
        },
        clearWishlist: () => {
          set({ items: [] })
        },
        isInWishlist: (itemId) => {
          return get().items.some((item) => item.id === itemId)
        },
      }),
      {
        name: 'wishlist-storage',
      }
    )
  )
) 