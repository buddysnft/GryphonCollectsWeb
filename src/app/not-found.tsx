import Link from "next/link";
import { brandConfig } from "@/config/brand";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-3xl font-bold text-text-primary mb-2">
            Page Not Found
          </h2>
          <p className="text-text-secondary">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="bg-primary text-background px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Go Home
          </Link>
          <Link
            href="/shop"
            className="bg-surface border border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-surface-hover transition"
          >
            Browse Products
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-text-muted text-sm mb-4">Looking for something specific?</p>
          <div className="flex justify-center gap-4 text-sm">
            <Link href="/breaks" className="text-primary hover:underline">
              Breaks
            </Link>
            <Link href="/account" className="text-primary hover:underline">
              Account
            </Link>
            <Link href="/cart" className="text-primary hover:underline">
              Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
