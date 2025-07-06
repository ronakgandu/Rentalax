export type UserType = 'renter' | 'owner' | 'both';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  avatar?: string;
  userType: UserType;
  verified: boolean;
  rating: number;
  joinedDate: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  images: string[];
  price: number;
  priceUnit: 'hour' | 'day' | 'week' | 'month';
  category: string;
  location: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  owner: User;
  available: boolean;
  availableDates?: {
    from: string;
    to: string;
  };
  condition: 'new' | 'like new' | 'good' | 'fair';
  allowBarter: boolean;
  rating: number;
  reviews: number;
  featured?: boolean;
}

export interface Booking {
  id: string;
  product: Product;
  renter: User;
  startDate: string;
  endDate: string;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  totalPrice: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
}

export interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  image: string;
}

export type SystemMessage = {
  id: string;
  type: 'system';
  content: string;
  timestamp: string;
};

export type ProductMessage = {
  id: string;
  type: 'product';
  product: Product;
  timestamp: string;
};

export type TextMessage = {
  id: string;
  type: 'text';
  content: string;
  sender: 'user' | 'other';
  timestamp: string;
};

export type ChatMessage = SystemMessage | ProductMessage | TextMessage;