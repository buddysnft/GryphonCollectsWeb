"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getBreaks } from "@/lib/firestore";
import BreakCard from "@/components/BreakCard";
import Hero from "@/components/Hero";
import NewsletterSignup from "@/components/NewsletterSignup";
import { BreakCardSkeleton } from "@/components/LoadingSkeletons";
import { brandConfig } from "@/config/brand";
import type { Break } from "@/lib/types";

export default function Home() {
  const [upcomingBreaks, setUpcomingBreaks] = useState<Break[]>([]);
  const [nextBreak, setNextBreak] = useState<Break | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeUntilNext, setTimeUntilNext] = useState<string>("");

  useEffect(() => {
    async function loadBreaks() {
      try {
        const allBreaks = await getBreaks([]);
        const upcoming = allBreaks
          .filter(b => b.isActive && b.date.seconds * 1000 > Date.now())
          .sort((a, b) => a.date.seconds - b.date.seconds);

        setUpcomingBreaks(upcoming.slice(0, 4));
        setNextBreak(upcoming[0] || null);
      } catch (error) {
        console.error("Error loading breaks:", error);
      } finally {
        setLoading(false);
      }
    }

    loadBreaks();
  }, []);

  // Countdown timer for next break
  useEffect(() => {
    if (!nextBreak) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const breakTime = nextBreak.date.seconds * 1000;
      const diff = breakTime - now;

      if (diff <= 0) {
        setTimeUntilNext("Starting soon!");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeUntilNext(`${days}d ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setTimeUntilNext(`${hours}h ${minutes}m`);
      } else {
        setTimeUntilNext(`${minutes}m`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [nextBreak]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Next Break Countdown - Only show if there is a next break */}
      {nextBreak && (
        <section className="py-12 px-4 bg-surface border-y border-border">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/30 rounded-xl p-8 text-center">
              <p className="text-sm font-semibold text-primary mb-2 uppercase tracking-wide">Next Break</p>
              <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-3">
                {nextBreak.title}
              </h2>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-6">
                {timeUntilNext}
              </div>
              <Link
                href={`/breaks/${nextBreak.id}`}
                className="inline-block bg-primary text-background px-8 py-4 rounded-lg font-bold hover:opacity-90 transition text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Reserve Your Spot →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Breaks */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-primary">Upcoming Breaks</h2>
              <p className="text-text-secondary mt-2">
                {upcomingBreaks.length} {upcomingBreaks.length === 1 ? 'break' : 'breaks'} scheduled
              </p>
            </div>
            <Link
              href="/breaks"
              className="text-primary hover:underline font-semibold"
            >
              View All Breaks →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              <>
                <BreakCardSkeleton />
                <BreakCardSkeleton />
                <BreakCardSkeleton />
                <BreakCardSkeleton />
              </>
            ) : upcomingBreaks.length > 0 ? (
              upcomingBreaks.map((breakData) => (
                <BreakCard key={breakData.id} breakData={breakData} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-text-secondary">
                <p className="text-lg mb-2">No breaks scheduled yet</p>
                <p className="text-sm">Check back soon for upcoming breaks!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Watch Live */}
      <section className="py-16 px-4 bg-surface">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">Watch Live Breaks</h2>
          <p className="text-text-secondary mb-8 text-lg">
            Join us live for exciting card breaks on your favorite platforms
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {brandConfig.social.youtube && (
              <a
                href={brandConfig.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-danger text-white px-6 py-3 rounded-lg hover:opacity-90 transition"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                YouTube Live
              </a>
            )}
            {brandConfig.social.instagram && (
              <a
                href={brandConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:opacity-90 transition"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                Instagram Live
              </a>
            )}
            {brandConfig.social.whatnot && (
              <a
                href={brandConfig.social.whatnot}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                Whatnot
              </a>
            )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-primary text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">Choose Your Break</h3>
              <p className="text-text-secondary">
                Browse upcoming breaks and select the one you want to join
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">Reserve Your Spot</h3>
              <p className="text-text-secondary">
                Select your team or spot and complete secure checkout
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">Watch & Win</h3>
              <p className="text-text-secondary">
                Join us live to see your cards pulled and shipped to you
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Shop CTA - Secondary */}
      <section className="py-12 px-4 bg-surface">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-3">
            Looking for Singles?
          </h2>
          <p className="text-text-secondary mb-6">
            Browse our selection of individual cards and sealed products
          </p>
          <Link
            href="/shop"
            className="inline-block bg-background border border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-surface-hover transition"
          >
            Visit Shop
          </Link>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <NewsletterSignup />
        </div>
      </section>
    </div>
  );
}
