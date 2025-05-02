import { Product } from '@/components/ui/product-card'

export const newArrivals: Product[] = [
  {
    id: '1',
    name: 'Tropical Palm Leaf Serving Tray',
    price: 42.99,
    image:
      'https://images.pexels.com/photos/6957851/pexels-photo-6957851.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Home Decor',
    isNew: true,
  },
  {
    id: '2',
    name: 'Hawaiian Sunset Canvas Print',
    price: 59.99,
    image:
      'https://images.pexels.com/photos/462024/pexels-photo-462024.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Wall Art',
    isNew: true,
    discount: 15,
  },
  {
    id: '3',
    name: 'Woven Seagrass Beach Hat',
    price: 34.99,
    image:
      'https://images.pexels.com/photos/1071162/pexels-photo-1071162.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Accessories',
    isNew: true,
  },
  {
    id: '4',
    name: 'Coconut Shell Candle Holders',
    price: 29.99,
    image:
      'https://images.pexels.com/photos/6957671/pexels-photo-6957671.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Home Decor',
    isNew: true,
    discount: 10,
  },
]

export const bestSellers: Product[] = [
  {
    id: '5',
    name: 'Handwoven Beach Bag',
    price: 49.99,
    image:
      'https://images.pexels.com/photos/775031/pexels-photo-775031.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Accessories',
    isBestSeller: true,
  },
  {
    id: '6',
    name: 'Tropical Fruit Bowl Set',
    price: 38.99,
    image:
      'https://images.pexels.com/photos/775031/pexels-photo-775031.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Kitchen & Dining',
    isBestSeller: true,
    discount: 20,
  },
  {
    id: '7',
    name: 'Ocean Wave Glass Ornament',
    price: 65.99,
    image:
      'https://images.pexels.com/photos/7586119/pexels-photo-7586119.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Collectibles',
    isBestSeller: true,
  },
  {
    id: '8',
    name: 'Bamboo Wind Chimes',
    price: 27.99,
    image:
      'https://images.pexels.com/photos/4755892/pexels-photo-4755892.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Outdoor',
    isBestSeller: true,
    discount: 25,
  },
]

export const testimonials = [
  {
    id: '1',
    name: 'Olivia Martinez',
    role: 'Resort Owner',
    content:
      'The beach-themed decorations have transformed our hotel gift shop. Guests love taking home a piece of their vacation experience.',
    avatar:
      'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '2',
    name: 'Kai Nakamura',
    role: 'Surf Instructor',
    content:
      "I've given the bamboo wind chimes to several of my surf students. The quality is excellent and they perfectly capture the island vibe.",
    avatar:
      'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '3',
    name: 'Leilani Wong',
    role: 'Travel Blogger',
    content:
      'These souvenirs are sustainably made and beautifully crafted. I feature them regularly in my tropical destination guides.',
    avatar:
      'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
]
