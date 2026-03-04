import Stripe from "stripe";

// Server-side Stripe instance (uses secret key)
// Lazy-loaded to avoid build-time errors when env vars aren't set
let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-12-18.acacia",
      typescript: true,
    });
  }
  return stripeInstance;
}

// Legacy export for backwards compatibility
export const stripe = new Proxy({} as Stripe, {
  get(target, prop) {
    return getStripe()[prop as keyof Stripe];
  }
});

// Client-side Stripe promise
// This loads the Stripe.js library and returns a promise
export const getStripePromise = async () => {
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set");
  }
  const { loadStripe } = await import("@stripe/stripe-js");
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
};
