import { z } from "zod";

// User validation
export const userSchema = z.object({
  uid: z.string().min(1),
  email: z.string().email(),
  displayName: z.string().min(1).max(100).optional(),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/).optional(),
  photoURL: z.string().url().optional(),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional(),
  role: z.enum(["user", "admin"]).default("user"),
  shippingAddress: z.object({
    street: z.string().min(1).max(200),
    city: z.string().min(1).max(100),
    state: z.string().min(2).max(2),
    zip: z.string().regex(/^\d{5}(-\d{4})?$/),
    country: z.string().min(2).max(2).default("US"),
  }).optional(),
  socials: z.object({
    instagram: z.string().url().optional(),
    youtube: z.string().url().optional(),
    tiktok: z.string().url().optional(),
  }).optional(),
});

export type UserInput = z.infer<typeof userSchema>;

// Product validation
export const productSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  price: z.number().positive(),
  originalPrice: z.number().positive().optional(),
  category: z.enum(["boxes", "cases", "singles", "slabs", "merch"]),
  sport: z.enum(["soccer", "basketball", "football", "baseball", "hockey", "merch"]),
  brand: z.string().min(1).max(100).optional(),
  year: z.string().regex(/^\d{4}(-\d{2})?$/).optional(),
  player: z.string().max(100).optional(),
  team: z.string().max(100).optional(),
  quantity: z.number().int().min(0),
  imageURLs: z.array(z.string().url()).default([]),
  tags: z.array(z.string()).default([]),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  gradeCompany: z.enum(["PSA", "BGS", "SGC", "CGC"]).optional(),
  gradeValue: z.string().optional(),
});

export type ProductInput = z.infer<typeof productSchema>;

// Break validation
export const breakSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000),
  date: z.date().or(z.object({ seconds: z.number(), nanoseconds: z.number() })),
  pricePerSpot: z.number().positive(),
  totalSpots: z.number().int().positive(),
  claimedSpots: z.number().int().min(0),
  breakFormat: z.enum(["Pick Your Team", "Pick Your Player", "Random", "Hit Draft"]),
  teams: z.array(z.string()).optional(),
  players: z.array(z.string()).optional(),
  imageURL: z.string().url().optional(),
  youtubeURL: z.string().url().optional(),
  instagramURL: z.string().url().optional(),
  status: z.enum(["upcoming", "live", "completed"]),
  isActive: z.boolean().default(true),
  notifyList: z.array(z.string()).default([]),
  participants: z.array(z.string()).default([]),
});

export type BreakInput = z.infer<typeof breakSchema>;

// Shipping address validation
export const shippingAddressSchema = z.object({
  street: z.string().min(1, "Street address is required").max(200),
  city: z.string().min(1, "City is required").max(100),
  state: z.string().length(2, "State must be 2 characters"),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code"),
  country: z.string().length(2).default("US"),
});

export type ShippingAddress = z.infer<typeof shippingAddressSchema>;

// Contact form validation
export const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required").max(200),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;

// Break notification signup
export const breakNotificationSchema = z.object({
  breakId: z.string().min(1),
  email: z.string().email("Invalid email address"),
});

export type BreakNotificationInput = z.infer<typeof breakNotificationSchema>;

// Order validation
export const orderItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive(),
  priceAtPurchase: z.number().positive(),
  productName: z.string().min(1),
});

export const orderSchema = z.object({
  userId: z.string().min(1),
  items: z.array(orderItemSchema).min(1, "Order must have at least one item"),
  subtotal: z.number().positive(),
  tax: z.number().min(0),
  shipping: z.number().min(0),
  total: z.number().positive(),
  shippingAddress: shippingAddressSchema,
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]),
  paymentIntentId: z.string().optional(),
  trackingNumber: z.string().optional(),
});

export type OrderInput = z.infer<typeof orderSchema>;

// Helper function for safe validation
export function validateOrThrow<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error("Validation errors:", result.error.errors);
    throw new Error(
      `Validation failed: ${result.error.errors.map(e => `${e.path.join(".")}: ${e.message}`).join(", ")}`
    );
  }
  return result.data;
}

// Helper function for safe validation with return
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } {
  const result = schema.safeParse(data);
  if (!result.success) {
    return {
      success: false,
      errors: result.error.errors.map(e => `${e.path.join(".")}: ${e.message}`),
    };
  }
  return { success: true, data: result.data };
}
