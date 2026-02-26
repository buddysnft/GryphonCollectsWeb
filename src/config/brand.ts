/**
 * WHITE-LABEL BRAND CONFIGURATION
 * Change these values to rebrand for different breakers
 */

export const brandConfig = {
  // Business Info
  businessName: "Gryphon Collects",
  tagline: "Your Home for Soccer Cards & Breaks",
  
  // Social Links
  social: {
    instagram: "https://instagram.com/gryphoncollects",
    youtube: "https://youtube.com/@gryphoncollects",
    tiktok: "https://tiktok.com/@gryphoncollects",
    whatsapp: "#", // Placeholder - will be filled in later
  },
  
  // Theme Colors
  colors: {
    background: "#0a0a14",
    surface: "#1a1a2e",
    surfaceHover: "#25253d",
    primary: "#d4a843", // Gold
    primaryLight: "rgba(212, 168, 67, 0.15)",
    textPrimary: "#ffffff",
    textSecondary: "#9ca3af",
    textMuted: "#6b7280",
    success: "#22c55e",
    danger: "#ef4444",
    border: "#2a2a3e",
  },
  
  // Logo & Assets
  logo: "/logo.png",
  favicon: "/favicon.png",
  
  // Primary Sport (for filtering defaults)
  primarySport: "Soccer",
  
  // Firebase Collection Names (keep these consistent)
  collections: {
    products: "products",
    breaks: "breaks",
    users: "users",
    orders: "orders",
    notifications: "notifications",
  },
};
