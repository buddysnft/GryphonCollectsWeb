"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { clearCart } from "@/lib/cart";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      // Clear the cart after successful checkout
      clearCart();
      setLoading(false);
    } else {
      // If no session ID, redirect to shop after 3 seconds
      setTimeout(() => {
        window.location.href = "/shop";
      }, 3000);
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4" />
          <p className="text-text-secondary">Processing your order...</p>
        </div>
      </div>
    );
  }

  if (!sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-text-secondary">No order found. Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg 
              className="w-12 h-12 text-success" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-primary mb-2">
            Order Confirmed!
          </h1>
          <p className="text-text-secondary mb-4">
            Thank you for your purchase. You'll receive a confirmation email shortly.
          </p>
          <p className="text-text-muted text-sm">
            Order ID: {sessionId.substring(0, 20)}...
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/shop"
            className="bg-primary text-background px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Continue Shopping
          </Link>
          <Link
            href="/account"
            className="bg-surface border border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-surface-hover transition"
          >
            View Orders
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-8 p-4 bg-surface border border-border rounded-lg text-left">
          <h3 className="text-text-primary font-semibold mb-2">What's Next?</h3>
          <ul className="space-y-2 text-text-secondary text-sm">
            <li>• Check your email for order confirmation</li>
            <li>• We'll notify you when your order ships</li>
            <li>• Track your order in your account</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4" />
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
