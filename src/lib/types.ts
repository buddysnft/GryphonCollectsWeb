import { Timestamp } from "firebase/firestore";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number | null;
  category: "Boxes" | "Cases" | "Singles" | "Slabs" | "Merch";
  sport: "Soccer" | "Merch";
  brand: string | null;
  year: string | null;
  player: string | null;
  team: string | null;
  gradeCompany: "PSA" | "BGS" | "SGC" | null;
  gradeValue: string | null;
  quantity: number;
  imageURLs: string[];
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
  breakFormat: "Pick Your Team" | "Pick Your Player" | "Random" | "Hit Draft";
  imageURL: string | null;
  youtubeURL: string | null;
  instagramURL: string | null;
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
  userId: string;
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
  }[];
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered";
  shippingAddress: {
    street: string;
    apt: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  createdAt: Timestamp;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
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
