"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getProducts, getBreaks } from "@/lib/firestore";
import { where, orderBy, limit as limitQuery, Timestamp } from "firebase/firestore";
import ProductCard from "@/components/ProductCard";
import BreakCard from "@/components/BreakCard";
import NewsletterSignup from "@/components/NewsletterSignup";
import { ProductCardSkeleton, BreakCardSkeleton } from "@/components/LoadingSkeletons";
import { brandConfig } from "@/config/brand";
import type { Product, Break } from "@/lib/types";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [upcomingBreaks, setUpcomingBreaks] = useState<Break[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch all products, filter on client side
        const allProducts = await getProducts([]);
        const featured = allProducts
          .filter(p => p.isFeatured && p.isActive)
          .slice(0, 4);

        // Fetch all breaks, filter on client side
        const allBreaks = await getBreaks([]);
        const upcoming = allBreaks
          .filter(b => b.isActive && b.date.seconds * 1000 > Date.now())
          .sort((a, b) => a.date.seconds - b.date.seconds)
          .slice(0, 3);

        setFeaturedProducts(featured);
        setUpcomingBreaks(upcoming);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-surface to-background py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-primary mb-4">
            {brandConfig.businessName}
          </h1>
          <p className="text-xl text-text-secondary mb-8">
            {brandConfig.tagline}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="bg-primary text-background px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition text-lg"
            >
              Shop Now
            </Link>
            <Link
              href="/breaks"
              className="bg-surface border border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-surface-hover transition text-lg"
            >
              View Breaks
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-primary">Available Now</h2>
            <Link
              href="/shop"
              className="text-text-secondary hover:text-primary transition"
            >
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              <>
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
              </>
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-text-secondary">
                No featured products yet
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Upcoming Breaks */}
      <section className="py-16 px-4 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-primary">Upcoming Breaks</h2>
            <Link
              href="/breaks"
              className="text-text-secondary hover:text-primary transition"
            >
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <>
                <BreakCardSkeleton />
                <BreakCardSkeleton />
                <BreakCardSkeleton />
              </>
            ) : upcomingBreaks.length > 0 ? (
              upcomingBreaks.map((breakData) => (
                <BreakCard key={breakData.id} breakData={breakData} />
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-text-secondary">
                No upcoming breaks scheduled
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <NewsletterSignup />
        </div>
      </section>

      {/* Social Links CTA */}
      <section className="py-16 px-4 bg-surface">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            Follow Us for Live Breaks
          </h2>
          <p className="text-text-secondary mb-6">
            Watch live breaks on YouTube, Instagram, and TikTok
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {brandConfig.social.instagram && (
              <a
                href={brandConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-background border border-border px-6 py-3 rounded-lg hover:border-primary transition"
                aria-label="Follow us on Instagram"
              >
                <span className="text-text-primary">Instagram</span>
              </a>
            )}
            {brandConfig.social.youtube && (
              <a
                href={brandConfig.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-background border border-border px-6 py-3 rounded-lg hover:border-primary transition"
                aria-label="Follow us on YouTube"
              >
                <span className="text-text-primary">YouTube</span>
              </a>
            )}
            {brandConfig.social.tiktok && (
              <a
                href={brandConfig.social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-background border border-border px-6 py-3 rounded-lg hover:border-primary transition"
                aria-label="Follow us on TikTok"
              >
                <span className="text-text-primary">TikTok</span>
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
