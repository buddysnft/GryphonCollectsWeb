"use client";

import Link from "next/link";
import { useState } from "react";
import { brandConfig } from "@/config/brand";
import { useAuth } from "@/lib/auth-context";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, userData, loading } = useAuth();

  return (
    <nav className="bg-surface border-b border-border sticky top-0 z-50" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3" aria-label="Home">
            <img 
              src="/logo.jpg" 
              alt="Gryphon Collects" 
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/shop" className="text-text-secondary hover:text-primary transition">
              Shop
            </Link>
            <Link href="/breaks" className="text-text-secondary hover:text-primary transition">
              Breaks
            </Link>
            <Link href="/cart" className="text-text-secondary hover:text-primary transition">
              Cart
            </Link>
            {!loading && user && (
              <Link href="/account" className="text-text-secondary hover:text-primary transition">
                Account
              </Link>
            )}
            {!loading && userData?.role === "admin" && (
              <Link href="/admin" className="text-primary hover:text-primary-hover font-semibold transition">
                Admin
              </Link>
            )}
            {!loading && !user && (
              <Link
                href="/login"
                className="bg-primary text-background px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-text-primary focus:outline-none focus:ring-2 focus:ring-primary rounded p-1"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              href="/shop"
              className="block px-4 py-2 text-text-secondary hover:text-primary hover:bg-surface-hover rounded transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              href="/breaks"
              className="block px-4 py-2 text-text-secondary hover:text-primary hover:bg-surface-hover rounded transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Breaks
            </Link>
            <Link
              href="/cart"
              className="block px-4 py-2 text-text-secondary hover:text-primary hover:bg-surface-hover rounded transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Cart
            </Link>
            {!loading && user && (
              <Link
                href="/account"
                className="block px-4 py-2 text-text-secondary hover:text-primary hover:bg-surface-hover rounded transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Account
              </Link>
            )}
            {!loading && userData?.role === "admin" && (
              <Link
                href="/admin"
                className="block px-4 py-2 text-primary hover:text-primary-hover font-semibold hover:bg-surface-hover rounded transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin
              </Link>
            )}
            {!loading && !user && (
              <Link
                href="/login"
                className="block px-4 py-2 bg-primary text-background rounded-lg font-semibold text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
