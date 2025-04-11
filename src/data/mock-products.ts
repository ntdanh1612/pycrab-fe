import { Product } from '@/components/ui/product-card'

export const newArrivals: Product[] = [
  {
    id: '1',
    name: 'Handcrafted Ceramic Vase',
    price: 49.99,
    image: 'https://picsum.photos/seed/vase1/400',
    category: 'Home Decor',
    isNew: true,
  },
  {
    id: '2',
    name: 'Traditional Tea Set',
    price: 89.99,
    image: 'https://picsum.photos/seed/tea1/400',
    category: 'Kitchen & Dining',
    isNew: true,
    discount: 15,
  },
  {
    id: '3',
    name: 'Silk Embroidered Scarf',
    price: 34.99,
    image: 'https://picsum.photos/seed/scarf1/400',
    category: 'Accessories',
    isNew: true,
  },
  {
    id: '4',
    name: 'Wooden Music Box',
    price: 59.99,
    image: 'https://picsum.photos/seed/music1/400',
    category: 'Collectibles',
    isNew: true,
    discount: 10,
  },
]

export const bestSellers: Product[] = [
  {
    id: '5',
    name: 'Artisan Leather Wallet',
    price: 79.99,
    image: 'https://picsum.photos/seed/wallet1/400',
    category: 'Accessories',
    isBestSeller: true,
  },
  {
    id: '6',
    name: 'Hand-painted Tea Cups',
    price: 45.99,
    image: 'https://picsum.photos/seed/cups1/400',
    category: 'Kitchen & Dining',
    isBestSeller: true,
    discount: 20,
  },
  {
    id: '7',
    name: 'Vintage Style Clock',
    price: 69.99,
    image: 'https://picsum.photos/seed/clock1/400',
    category: 'Home Decor',
    isBestSeller: true,
  },
  {
    id: '8',
    name: 'Handwoven Basket Set',
    price: 54.99,
    image: 'https://picsum.photos/seed/basket1/400',
    category: 'Home Decor',
    isBestSeller: true,
    discount: 25,
  },
]

export const testimonials = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Interior Designer',
    content:
      "The quality of the handcrafted items is exceptional. Each piece tells a unique story and adds character to my clients' homes.",
    avatar: 'https://picsum.photos/seed/sarah1/200',
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'Art Collector',
    content:
      "I'm impressed by the authenticity and attention to detail in every product. The cultural significance behind each item makes them truly special.",
    avatar: 'https://picsum.photos/seed/michael1/200',
  },
  {
    id: '3',
    name: 'Emma Davis',
    role: 'Travel Enthusiast',
    content:
      'These souvenirs bring back wonderful memories of my travels. The packaging and presentation are always perfect for gifting.',
    avatar: 'https://picsum.photos/seed/emma1/200',
  },
]
