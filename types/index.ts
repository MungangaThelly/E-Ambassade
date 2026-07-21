// TypeScript types for the application
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  preferredLanguage?: 'fr' | 'sv' | 'en';
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  userId: string;
  date: string;
  time: string;
  serviceType: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'email' | 'sms';
  subject: string;
  message: string;
  status: 'sent' | 'failed' | 'pending';
  createdAt: string;
}

export interface AdminStats {
  totalBookings: number;
  pendingBookings: number;
  completedBookings: number;
  totalUsers: number;
  activeUsers: number;
}

export interface Session {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  expires: string;
}
