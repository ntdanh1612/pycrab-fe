export interface Product {
  id: string;
  image: string;
  name: string;
  price: number;
  rating: number;
  reviewCount: number;
}

export const mockProducts: Product[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
    name: 'Smart Watch Series 5',
    price: 299.99,
    rating: 4.5,
    reviewCount: 128
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    name: 'Wireless Headphones Pro',
    price: 199.99,
    rating: 4.8,
    reviewCount: 256
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12',
    name: 'Portable Bluetooth Speaker',
    price: 89.99,
    rating: 4.3,
    reviewCount: 89
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90',
    name: 'Gaming Keyboard RGB',
    price: 149.99,
    rating: 4.7,
    reviewCount: 312
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1526170375885-4d5fc6051ced',
    name: '4K Action Camera',
    price: 399.99,
    rating: 4.6,
    reviewCount: 178
  }
]; 