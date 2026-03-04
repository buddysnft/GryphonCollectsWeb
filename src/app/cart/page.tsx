"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getCart, updateCartItemQuantity, removeFromCart, getCartTotal, clearCart } from "@/lib/cart";
import { getStripePromise } from "@/lib/stripe";
import type { CartItem } from "@/lib/types";

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    loadCart();
    window.addEventListener("cartUpdated", loadCart);
    return () => window.removeEventListener("cartUpdated", loadCart);
  }, []);

  const loadCart = () => {
    setCart(getCart());
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    updateCartItemQuantity(productId, newQuantity);
  };

  const handleRemove = (productId: string) => {
    removeFromCart(productId);
  };

  const handleCheckout = async () => {
    setCheckingOut(true);
    try {
      // Call checkout API to create Stripe session
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems: cart }),
      });

      if (!response.ok) {
        throw new Error("Checkout failed");
      }

      const { sessionId } = await response.json();
      
      // Redirect to Stripe Checkout
      const stripe = await getStripePromise();
      const result = await stripe?.redirectToCheckout({ sessionId });

      if (result?.error) {
        throw new Error(result.error.message);
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      alert("Checkout failed. Please try again.");
      setCheckingOut(false);
    }
  };

  const total = getCartTotal();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <svg
            className="w-24 h-24 text-text-muted mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-text-primary mb-2">Your cart is empty</h2>
          <p className="text-text-secondary mb-6">Add some products to get started</p>
          <button
            onClick={() => router.push("/shop")}
            className="bg-primary text-background px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-primary mb-8">Shopping Cart</h1>

        {/* Cart Items */}
        <div className="space-y-4 mb-8">
          {cart.map((item) => (
            <div key={item.productId} className="bg-surface border border-border rounded-lg p-4">
              <div className="flex gap-4">
                {/* Image */}
                <div className="relative w-24 h-24 bg-background rounded-lg overflow-hidden flex-shrink-0">
                  {item.imageURL ? (
                    <Image
                      src={item.imageURL}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-text-muted"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="text-text-primary font-semibold mb-1">{item.productName}</h3>
                  <p className="text-primary font-bold">${item.price.toFixed(2)}</p>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                    className="bg-background border border-border w-8 h-8 rounded hover:border-primary transition"
                  >
                    -
                  </button>
                  <span className="text-text-primary font-semibold w-8 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                    className="bg-background border border-border w-8 h-8 rounded hover:border-primary transition"
                  >
                    +
                  </button>
                </div>

                {/* Remove */}
                <button
                  onClick={() => handleRemove(item.productId)}
                  className="text-danger hover:underline ml-4"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xl font-semibold text-text-primary">Total</span>
            <span className="text-3xl font-bold text-primary">${total.toFixed(2)}</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={checkingOut}
            className="w-full bg-primary text-background py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed mb-2"
          >
            {checkingOut ? "Redirecting to checkout..." : "Proceed to Checkout"}
          </button>
          
          <div className="flex items-center justify-center gap-2 text-text-muted text-xs">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span>Secure checkout powered by Stripe</span>
          </div>
        </div>
      </div>
    </div>
  );
}
