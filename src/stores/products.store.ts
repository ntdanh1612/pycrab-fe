import { create } from 'zustand'
import { Product } from '@/components/ui/product-card'
import { newArrivals, bestSellers } from '@/data/mock-products'

// Combine mock data products for now - would be replaced with API calls
const mockProducts: Product[] = [...newArrivals, ...bestSellers]

// Add more product categories
const allCategories = Array.from(
  new Set(mockProducts.map((product) => product.category))
)

// Add more mock products for demonstration purposes
const extendedMockProducts: Product[] = [
  ...mockProducts,
  {
    id: '9',
    name: 'Pineapple Motif Beach Towel',
    price: 32.99,
    image:
      'https://images.pexels.com/photos/4814061/pexels-photo-4814061.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Beach Accessories',
    isNew: true,
  },
  {
    id: '10',
    name: 'Driftwood Wall Clock',
    price: 79.99,
    image:
      'https://images.pexels.com/photos/1201471/pexels-photo-1201471.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Home Decor',
    isBestSeller: true,
  },
  {
    id: '11',
    name: 'Sunset Palm Framed Print',
    price: 64.99,
    image:
      'https://images.pexels.com/photos/1154638/pexels-photo-1154638.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Wall Art',
    discount: 15,
  },
  {
    id: '12',
    name: 'Conch Shell Earrings',
    price: 24.99,
    image:
      'https://images.pexels.com/photos/1493320/pexels-photo-1493320.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Jewelry',
  },
]

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'

interface ProductsState {
  products: Product[]
  filteredProducts: Product[]
  categories: string[]
  searchQuery: string
  selectedCategory: string | null
  sortBy: SortOption
  priceRange: [number, number]
  isLoading: boolean
  
  // Actions
  loadProducts: () => Promise<void>
  setSearchQuery: (query: string) => void
  setSelectedCategory: (category: string | null) => void
  setSortBy: (option: SortOption) => void
  setPriceRange: (range: [number, number]) => void
  getProductById: (id: string) => Product | undefined
  getRelatedProducts: (productId: string, limit?: number) => Product[]
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: extendedMockProducts,
  filteredProducts: extendedMockProducts,
  categories: allCategories,
  searchQuery: '',
  selectedCategory: null,
  sortBy: 'default',
  priceRange: [0, 100],
  isLoading: false,

  loadProducts: async () => {
    set({ isLoading: true })
    
    // Simulate API fetch delay
    await new Promise((resolve) => setTimeout(resolve, 800))
    
    // This would be an API call in a real application
    set({ 
      products: extendedMockProducts,
      filteredProducts: extendedMockProducts,
      isLoading: false
    })
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query })
    const { products, selectedCategory, priceRange, sortBy } = get()
    const filtered = filterProducts(products, query, selectedCategory, priceRange)
    const sorted = sortProducts(filtered, sortBy)
    set({ filteredProducts: sorted })
  },

  setSelectedCategory: (category) => {
    set({ selectedCategory: category })
    const { products, searchQuery, priceRange, sortBy } = get()
    const filtered = filterProducts(products, searchQuery, category, priceRange)
    const sorted = sortProducts(filtered, sortBy)
    set({ filteredProducts: sorted })
  },

  setSortBy: (option) => {
    set({ sortBy: option })
    const { filteredProducts } = get()
    const sorted = sortProducts(filteredProducts, option)
    set({ filteredProducts: sorted })
  },

  setPriceRange: (range) => {
    set({ priceRange: range })
    const { products, searchQuery, selectedCategory, sortBy } = get()
    const filtered = filterProducts(products, searchQuery, selectedCategory, range)
    const sorted = sortProducts(filtered, sortBy)
    set({ filteredProducts: sorted })
  },

  getProductById: (id) => {
    return get().products.find((product) => product.id === id)
  },

  getRelatedProducts: (productId, limit = 4) => {
    const product = get().getProductById(productId)
    if (!product) return []

    return get().products
      .filter(p => p.id !== productId && p.category === product.category)
      .slice(0, limit)
  }
}))

// Helper functions for filtering and sorting
function filterProducts(
  products: Product[],
  query: string,
  category: string | null,
  priceRange: [number, number]
): Product[] {
  return products.filter((product) => {
    const matchesQuery = query === '' || 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
    
    const matchesCategory = !category || product.category === category
    
    const actualPrice = product.discount 
      ? product.price * (1 - product.discount / 100) 
      : product.price
    
    const matchesPrice = 
      actualPrice >= priceRange[0] && actualPrice <= priceRange[1]

    return matchesQuery && matchesCategory && matchesPrice
  })
}

function sortProducts(products: Product[], sortBy: SortOption): Product[] {
  const sortedProducts = [...products]
  
  switch (sortBy) {
    case 'price-asc':
      return sortedProducts.sort((a, b) => {
        const aPrice = a.discount ? a.price * (1 - a.discount / 100) : a.price
        const bPrice = b.discount ? b.price * (1 - b.discount / 100) : b.price
        return aPrice - bPrice
      })
    case 'price-desc':
      return sortedProducts.sort((a, b) => {
        const aPrice = a.discount ? a.price * (1 - a.discount / 100) : a.price
        const bPrice = b.discount ? b.price * (1 - b.discount / 100) : b.price
        return bPrice - aPrice
      })
    case 'name-asc':
      return sortedProducts.sort((a, b) => a.name.localeCompare(b.name))
    case 'name-desc':
      return sortedProducts.sort((a, b) => b.name.localeCompare(a.name))
    default:
      return sortedProducts
  }
} 