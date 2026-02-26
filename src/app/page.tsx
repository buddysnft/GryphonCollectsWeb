"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getProducts, getBreaks } from "@/lib/firestore";
import { where, orderBy, limit as limitQuery, Timestamp } from "firebase/firestore";
import ProductCard from "@/components/ProductCard";
import BreakCard from "@/components/BreakCard";
import { brandConfig } from "@/config/brand";
import type { Product, Break } from "@/lib/types";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [upcomingBreaks, setUpcomingBreaks] = useState<Break[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch featured products
        const products = await getProducts([
          where("isFeatured", "==", true),
          where("isActive", "==", true),
          limitQuery(4),
        ]);

        // Fetch upcoming breaks
        const breaks = await getBreaks([
          where("isActive", "==", true),
          where("date", ">=", Timestamp.now()),
          orderBy("date", "asc"),
          limitQuery(3),
        ]);

        setFeaturedProducts(products);
        setUpcomingBreaks(breaks);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-secondary">Loading...</div>
      </div>
    );
  }

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
      {featuredProducts.length > 0 && (
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
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Breaks */}
      {upcomingBreaks.length > 0 && (
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
              {upcomingBreaks.map((breakData) => (
                <BreakCard key={breakData.id} breakData={breakData} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Social Links CTA */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            Follow Us for Live Breaks
          </h2>
          <p className="text-text-secondary mb-6">
            Stay updated on new drops, live breaks, and exclusive deals
          </p>
          <div className="flex justify-center gap-6">
            {brandConfig.social.instagram && (
              <a
                href={brandConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-surface border border-border px-6 py-3 rounded-lg hover:border-primary transition"
              >
                <span className="text-text-primary">Instagram</span>
              </a>
            )}
            {brandConfig.social.youtube && (
              <a
                href={brandConfig.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-surface border border-border px-6 py-3 rounded-lg hover:border-primary transition"
              >
                <span className="text-text-primary">YouTube</span>
              </a>
            )}
            {brandConfig.social.tiktok && (
              <a
                href={brandConfig.social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-surface border border-border px-6 py-3 rounded-lg hover:border-primary transition"
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
