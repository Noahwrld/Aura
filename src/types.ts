export type ServiceCategory = 'massage' | 'facial' | 'mindbody' | 'rituals';

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  duration: number; // in minutes
  price: number; // in USD
  description: string;
  image: string;
  benefits: string[];
}

export interface Therapist {
  id: string;
  name: string;
  role: string;
  rating: number;
  reviewsCount: number;
  specialties: string[];
  avatar: string;
  bio: string;
  availableHours: string[];
}

export interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string; // Service name
  therapist: string; // Therapist name
  date: string; // YYYY-MM-DD
  time: string; // e.g., "10:00 AM"
  specialRequests?: string;
  promoCode?: string;
  newsletter: boolean;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}
