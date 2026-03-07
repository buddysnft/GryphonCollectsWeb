import { Timestamp } from "firebase/firestore";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number | null;
  saleEndDate: Timestamp | null; // For flash sales with countdown
  category: "BOXES" | "CASES" | "SINGLES" | "SLABS" | "MERCH";
  sport: "Soccer" | "Merch";
  brand: string | null;
  year: string | null;
  player: string | null;
  team: string | null;
  gradeCompany: "None" | "PSA" | "BGS" | "SGC" | null;
  gradeValue: string | null;
  quantity: number;
  imageURLs: string[]; // Up to 5 images
  tags: string[];
  isFeatured: boolean;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Break {
  id: string;
  title: string;
  description: string;
  date: Timestamp;
  pricePerSpot: number;
  totalSpots: number;
  claimedSpots: number;
  breakFormat: "Pick Your Team" | "Random Team" | "Random Number" | "Custom";
  teams: string[] | null; // For team-based breaks
  spotLabels?: { [spotNumber: number]: string }; // Optional custom labels (team names, player names, etc.)
  imageURL: string | null;
  youtubeURL: string | null;
  instagramURL: string | null;
  status: "upcoming" | "live" | "completed";
  isActive: boolean;
  notifyList: string[];
  participants: string[];
  createdAt: Timestamp;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  role?: "admin";
  shippingAddress: {
    street: string;
    apt: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  } | null;
  createdAt: Timestamp;
}

export interface Order {
  id: string;
  // Old format fields (product orders)
  userId?: string;
  items?: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
  }[];
  total?: number;
  shippingAddress?: {
    street: string;
    apt: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  holdForPickup?: boolean;
  
  // New format fields (webhook orders)
  type?: "product" | "break";
  customerEmail?: string;
  customerName?: string;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  amount?: number;
  
  // Break-specific fields
  breakId?: string;
  spots?: number[];
  pricePerSpot?: number;
  teamAssignment?: string; // NEW: Team assigned after break (e.g., "Liverpool")
  
  // Common fields
  status: "pending" | "confirmed" | "shipped" | "delivered" | "held" | "test";
  trackingNumber?: string | null; // Updated for new orders
  shippedAt?: Timestamp; // NEW: When marked as shipped
  createdAt: Timestamp | any; // Flexible for multiple formats
  updatedAt?: Timestamp | any;
}

export interface Notification {
  id: string;
  type: "New Product" | "Break Going Live" | "Flash Sale" | "Custom";
  title: string;
  body: string;
  sentTo: "all" | "break-subscribers";
  breakId?: string; // If sentTo == "break-subscribers"
  createdAt: Timestamp;
}

// Cart item (local storage only)
export interface CartItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  imageURL?: string;
}
