/**
 * Room and Booking Types for Sunset Hills Wayanad
 */

export interface Room {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  amenities: string; // Comma separated for easy editing in admin panel
  createdAt: string;
}

export interface Booking {
  id: string;
  userId: string;
  userEmail: string;
  roomId: string;
  roomName?: string;
  nights?: number;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  hasPoolAddon: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  isAdmin?: boolean;
}

export interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
  category?: string;
  order: number;
  createdAt: string;
}

export interface RoomBlock {
  id: string;
  roomId: string;
  date: string; // YYYY-MM-DD
  note?: string;
  createdAt: string;
}
