"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Break } from "@/lib/types";

interface FeaturedBreaksCarouselProps {
  breaks: Break[];
}

export default function FeaturedBreaksCarousel({ breaks }: FeaturedBreaksCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying || breaks.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % breaks.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, breaks.length]);

  if (breaks.length === 0) return null;

  const currentBreak = breaks[currentIndex];
  const soldSpots = currentBreak.soldSpots?.length || 0;
  const totalSpots = currentBreak.totalSpots || 0;
  const spotsLeft = totalSpots - soldSpots;
  const percentSold = totalSpots > 0 ? Math.round((soldSpots / totalSpots) * 100) : 0;

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % breaks.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + breaks.length) % breaks.length);
    setIsAutoPlaying(false);
  };

  return (
    <div className="relative bg-gradient-to-br from-surface via-surface to-surface-hover rounded-2xl overflow-hidden border border-border shadow-2xl">
      {/* Main Featured Break */}
      <div className="relative min-h-[400px] md:min-h-[500px] flex items-center">
        {/* Background Image with Overlay */}
        {currentBreak.imageUrl && (
          <div className="absolute inset-0">
            <Image
              src={currentBreak.imageUrl}
              alt={currentBreak.title}
              fill
              className="object-cover opacity-20"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-transparent" />
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 w-full px-8 md:px-16 py-12">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/40 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-primary font-semibold text-sm uppercase tracking-wide">
                Featured Break
              </span>
            </div>

            {/* Title */}
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4 leading-tight">
              {currentBreak.title}
            </h2>

            {/* Description */}
            {currentBreak.description && (
              <p className="text-text-secondary text-lg md:text-xl mb-6 line-clamp-2">
                {currentBreak.description}
              </p>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {/* Price */}
              <div className="bg-background/50 backdrop-blur-sm rounded-lg p-4 border border-border/50">
                <p className="text-text-secondary text-xs uppercase tracking-wide mb-1">Price</p>
                <p className="text-primary text-2xl font-bold">
                  ${currentBreak.price}
                </p>
              </div>

              {/* Spots Left */}
              <div className="bg-background/50 backdrop-blur-sm rounded-lg p-4 border border-border/50">
                <p className="text-text-secondary text-xs uppercase tracking-wide mb-1">Spots Left</p>
                <p className="text-primary text-2xl font-bold">
                  {spotsLeft}/{totalSpots}
                </p>
              </div>

              {/* Date */}
              <div className="bg-background/50 backdrop-blur-sm rounded-lg p-4 border border-border/50">
                <p className="text-text-secondary text-xs uppercase tracking-wide mb-1">Breaking</p>
                <p className="text-text-primary text-lg font-semibold">
                  {new Date(currentBreak.date.seconds * 1000).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-text-secondary">Sold</span>
                <span className="text-sm font-semibold text-primary">{percentSold}%</span>
              </div>
              <div className="w-full bg-surface-hover rounded-full h-3 overflow-hidden border border-border">
                <div
                  className="bg-gradient-to-r from-primary to-primary/80 h-full transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${percentSold}%` }}
                />
              </div>
            </div>

            {/* CTA */}
            <Link
              href={`/breaks/${currentBreak.id}`}
              className="inline-flex items-center gap-3 bg-primary text-background px-8 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Reserve Your Spot
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows - Desktop */}
      {breaks.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center bg-background/80 backdrop-blur-sm border border-border rounded-full hover:bg-background transition-all"
            aria-label="Previous break"
          >
            <svg className="w-6 h-6 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center bg-background/80 backdrop-blur-sm border border-border rounded-full hover:bg-background transition-all"
            aria-label="Next break"
          >
            <svg className="w-6 h-6 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {breaks.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {breaks.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-primary w-8'
                  : 'bg-border hover:bg-border-hover'
              }`}
              aria-label={`Go to break ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
