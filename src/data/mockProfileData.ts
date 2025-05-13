import type { Address, PaymentMethod, Order, Notification } from '@/stores/profile.store'

export function generateMockData() {
  // Mock addresses
  const addresses: Address[] = [
    {
      id: 'addr_1',
      userId: 'user_1',
      name: 'John Doe',
      addressLine1: '123 Main Street',
      addressLine2: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'us',
      phone: '(212) 555-1234',
      isDefault: true,
      createdAt: '2023-05-15T10:30:00Z',
      updatedAt: '2023-05-15T10:30:00Z'
    },
    {
      id: 'addr_2',
      userId: 'user_1',
      name: 'John Doe',
      addressLine1: '456 Park Avenue',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94107',
      country: 'us',
      phone: '(415) 555-6789',
      isDefault: false,
      createdAt: '2023-06-20T14:45:00Z',
      updatedAt: '2023-06-20T14:45:00Z'
    }
  ]

  // Mock payment methods
  const paymentMethods: PaymentMethod[] = [
    {
      id: 'pm_1',
      userId: 'user_1',
      type: 'card',
      lastFour: '4242',
      expiryDate: '05/28',
      cardType: 'visa',
      isDefault: true,
      createdAt: '2023-05-15T10:35:00Z',
      updatedAt: '2023-05-15T10:35:00Z'
    },
    {
      id: 'pm_2',
      userId: 'user_1',
      type: 'paypal',
      isDefault: false,
      createdAt: '2023-07-10T08:20:00Z',
      updatedAt: '2023-07-10T08:20:00Z'
    }
  ]

  // Mock order items (to be used in orders)
  const orderItems = [
    {
      id: 'item_1',
      orderId: 'order_1',
      productId: 'prod_1',
      name: 'Premium Gift Box',
      price: 49.99,
      quantity: 1,
      imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=200',
      variant: 'Red'
    },
    {
      id: 'item_2',
      orderId: 'order_1',
      productId: 'prod_2',
      name: 'Scented Candle Set',
      price: 24.99,
      quantity: 2,
      imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=200'
    },
    {
      id: 'item_3',
      orderId: 'order_2',
      productId: 'prod_3',
      name: 'Handcrafted Ceramic Mug',
      price: 18.99,
      quantity: 4,
      imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=200',
      variant: 'Blue'
    },
    {
      id: 'item_4',
      orderId: 'order_3',
      productId: 'prod_4',
      name: 'Personalized Photo Frame',
      price: 34.99,
      quantity: 1,
      imageUrl: 'https://images.unsplash.com/photo-1581343600645-1e8a58f3f239?q=80&w=200'
    },
    {
      id: 'item_5',
      orderId: 'order_3',
      productId: 'prod_5',
      name: 'Luxury Chocolate Box',
      price: 29.99,
      quantity: 1,
      imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=200'
    },
    {
      id: 'item_6',
      orderId: 'order_4',
      productId: 'prod_6',
      name: 'Birthday Gift Basket',
      price: 59.99,
      quantity: 1,
      imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=200'
    }
  ]

  // Mock orders
  const orders: Order[] = [
    {
      id: 'order_1',
      userId: 'user_1',
      orderNumber: 'ORD-2023-1001',
      status: 'delivered',
      total: 99.97,
      items: [orderItems[0], orderItems[1]],
      shippingAddress: addresses[0],
      billingAddress: addresses[0],
      paymentMethod: paymentMethods[0],
      trackingNumber: 'TRK123456789',
      estimatedDelivery: '2023-05-20T00:00:00Z',
      createdAt: '2023-05-15T10:40:00Z',
      updatedAt: '2023-05-18T14:30:00Z'
    },
    {
      id: 'order_2',
      userId: 'user_1',
      orderNumber: 'ORD-2023-1045',
      status: 'shipped',
      total: 75.96,
      items: [orderItems[2]],
      shippingAddress: addresses[0],
      billingAddress: addresses[0],
      paymentMethod: paymentMethods[0],
      trackingNumber: 'TRK987654321',
      estimatedDelivery: '2023-08-05T00:00:00Z',
      createdAt: '2023-07-30T16:20:00Z',
      updatedAt: '2023-08-01T09:15:00Z'
    },
    {
      id: 'order_3',
      userId: 'user_1',
      orderNumber: 'ORD-2023-1098',
      status: 'processing',
      total: 64.98,
      items: [orderItems[3], orderItems[4]],
      shippingAddress: addresses[1],
      billingAddress: addresses[0],
      paymentMethod: paymentMethods[1],
      createdAt: '2023-09-22T11:10:00Z',
      updatedAt: '2023-09-22T14:45:00Z'
    },
    {
      id: 'order_4',
      userId: 'user_1',
      orderNumber: 'ORD-2023-1142',
      status: 'pending',
      total: 59.99,
      items: [orderItems[5]],
      shippingAddress: addresses[1],
      billingAddress: addresses[1],
      paymentMethod: paymentMethods[0],
      createdAt: '2023-10-10T08:30:00Z',
      updatedAt: '2023-10-10T08:30:00Z'
    }
  ]

  // Mock notifications
  const notifications: Notification[] = [
    {
      id: 'notif_1',
      userId: 'user_1',
      type: 'order',
      title: 'Order Shipped',
      message: 'Your order ORD-2023-1045 has been shipped. Estimated delivery: August 5, 2023.',
      isRead: false,
      createdAt: '2023-08-01T09:15:00Z',
      link: '/profile/orders/order_2'
    },
    {
      id: 'notif_2',
      userId: 'user_1',
      type: 'order',
      title: 'Order Delivered',
      message: 'Your order ORD-2023-1001 has been delivered.',
      isRead: true,
      createdAt: '2023-05-19T15:30:00Z',
      link: '/profile/orders/order_1'
    },
    {
      id: 'notif_3',
      userId: 'user_1',
      type: 'account',
      title: 'Profile Updated',
      message: 'Your account information has been successfully updated.',
      isRead: true,
      createdAt: '2023-06-25T10:15:00Z'
    },
    {
      id: 'notif_4',
      userId: 'user_1',
      type: 'promotion',
      title: 'Special Offer',
      message: 'Get 20% off on all gift baskets this week. Use code: BASKET20',
      isRead: false,
      createdAt: '2023-10-05T08:00:00Z',
      link: '/products?category=gift-baskets'
    },
    {
      id: 'notif_5',
      userId: 'user_1',
      type: 'system',
      title: 'New Payment Method Added',
      message: 'A new PayPal payment method has been added to your account.',
      isRead: true,
      createdAt: '2023-07-10T08:25:00Z'
    },
    {
      id: 'notif_6',
      userId: 'user_1',
      type: 'order',
      title: 'Order Processing',
      message: 'Your order ORD-2023-1098 is now being processed.',
      isRead: false,
      createdAt: '2023-09-22T14:45:00Z',
      link: '/profile/orders/order_3'
    }
  ]

  return {
    addresses,
    paymentMethods,
    orders,
    notifications
  }
} 