import type { CartItem } from "./types";

const CART_KEY = "gryphon-cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(CART_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function addToCart(item: CartItem) {
  const cart = getCart();
  const existingIndex = cart.findIndex((i) => i.productId === item.productId);

  if (existingIndex >= 0) {
    cart[existingIndex].quantity += item.quantity;
  } else {
    cart.push(item);
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
}

export function updateCartItemQuantity(productId: string, quantity: number) {
  const cart = getCart();
  const index = cart.findIndex((i) => i.productId === productId);

  if (index >= 0) {
    if (quantity <= 0) {
      cart.splice(index, 1);
    } else {
      cart[index].quantity = quantity;
    }
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
  }
}

export function removeFromCart(productId: string) {
  const cart = getCart().filter((i) => i.productId !== productId);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
  window.dispatchEvent(new Event("cartUpdated"));
}

export function getCartTotal(): number {
  return getCart().reduce((total, item) => total + item.price * item.quantity, 0);
}

export function getCartCount(): number {
  return getCart().reduce((count, item) => count + item.quantity, 0);
}
