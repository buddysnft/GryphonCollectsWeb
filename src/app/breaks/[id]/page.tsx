"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { getBreak } from "@/lib/firestore";
import type { Break } from "@/lib/types";
import Badge from "@/components/Badge";
import { brandConfig } from "@/config/brand";

export default function BreakDetailPage() {
  const params = useParams();
  const router = useRouter();
  const breakId = params.id as string;

  const [breakData, setBreakData] = useState<Break | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSpots, setSelectedSpots] = useState<number[]>([]);
  const [checkingOut, setCheckingOut] = useState(false);
  const [holdForPickup, setHoldForPickup] = useState(false);

  useEffect(() => {
    async function loadBreak() {
      try {
        const data = await getBreak(breakId);
        if (!data) {
          router.push("/breaks");
          return;
        }
        setBreakData(data);
      } catch (error) {
        console.error("Error loading break:", error);
        router.push("/breaks");
      } finally {
        setLoading(false);
      }
    }

    loadBreak();
  }, [breakId, router]);

  const formatDate = (timestamp: any) => {
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  };

  const toggleSpot = (spotNumber: number) => {
    if (selectedSpots.includes(spotNumber)) {
      setSelectedSpots(selectedSpots.filter(s => s !== spotNumber));
    } else {
      setSelectedSpots([...selectedSpots, spotNumber]);
    }
  };

  const handleCheckout = async () => {
    if (selectedSpots.length === 0) {
      alert("Please select at least one spot");
      return;
    }

    setCheckingOut(true);
    try {
      // Calculate individual spot prices for checkout
      const spotPricesForCheckout: { [key: number]: number } = {};
      selectedSpots.forEach(spotNum => {
        spotPricesForCheckout[spotNum] = getSpotPrice(spotNum);
      });
      
      const response = await fetch("/api/checkout/break", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          breakId,
          spots: selectedSpots,
          pricePerSpot: breakData!.pricePerSpot, // Default price (for backwards compatibility)
          spotPrices: spotPricesForCheckout, // Individual prices
          breakTitle: breakData!.title,
          holdForPickup, // Local pickup option
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Checkout failed");
      }

      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      alert("Checkout failed. Please try again.");
      setCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-secondary">Loading break details...</div>
      </div>
    );
  }

  if (!breakData) {
    return null;
  }

  const spotsRemaining = breakData.totalSpots - breakData.claimedSpots;
  
  // Calculate total price using individual spot prices if available
  const totalPrice = selectedSpots.reduce((sum, spotNum) => {
    const spotPrice = breakData.spotPrices?.[spotNum] || breakData.pricePerSpot;
    return sum + spotPrice;
  }, 0);
  
  // Helper function to get price for a specific spot
  const getSpotPrice = (spotNumber: number) => {
    return breakData.spotPrices?.[spotNumber] || breakData.pricePerSpot;
  };

  return (
    <div className="min-h-screen py-6 sm:py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push("/breaks")}
          className="text-primary hover:underline mb-6 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Breaks
        </button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Image & Details */}
          <div>
            {/* Image */}
            <div className="relative aspect-video bg-background rounded-lg overflow-hidden mb-6">
              {breakData.imageURL ? (
                <Image
                  src={breakData.imageURL}
                  alt={breakData.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-24 h-24 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="bg-surface border border-border rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold text-text-primary">{breakData.title}</h1>
                <Badge variant="primary">{breakData.breakFormat}</Badge>
              </div>

              <div className="space-y-3 text-text-secondary">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{formatDate(breakData.date)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-2xl font-bold text-primary">${breakData.pricePerSpot.toFixed(2)}</span>
                  <span>per spot</span>
                </div>

                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>{spotsRemaining} of {breakData.totalSpots} spots remaining</span>
                </div>
              </div>

              {breakData.description && (
                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="font-semibold text-text-primary mb-2">Description</h3>
                  <p className="text-text-secondary whitespace-pre-wrap">{breakData.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Spot Selection */}
          <div>
            <div className="bg-surface border border-border rounded-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-text-primary mb-4">Select Your Spots</h2>

              {/* Spot Grid */}
              {/* Dynamic grid: more columns for numbers-only, fewer for team/player names */}
              <div className={`grid ${breakData.spotLabels ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4' : 'grid-cols-5 sm:grid-cols-6 md:grid-cols-8'} gap-2 sm:gap-3 mb-6 max-h-96 overflow-y-auto p-1`}>
                {Array.from({ length: breakData.totalSpots }, (_, i) => i + 1).map((spotNumber) => {
                  const isClaimed = breakData.claimedSpots >= spotNumber;
                  const isSelected = selectedSpots.includes(spotNumber);
                  const spotLabel = breakData.spotLabels?.[spotNumber] || spotNumber.toString();
                  const hasCustomLabel = breakData.spotLabels?.[spotNumber];
                  const spotPrice = getSpotPrice(spotNumber);
                  const hasCustomPrice = breakData.spotPrices?.[spotNumber] !== undefined;

                  return (
                    <button
                      key={spotNumber}
                      onClick={() => !isClaimed && toggleSpot(spotNumber)}
                      disabled={isClaimed}
                      className={`
                        ${hasCustomLabel ? 'min-h-[70px] sm:min-h-[80px] py-3 px-2' : 'min-h-[60px] sm:min-h-[65px] py-2 px-1'} 
                        rounded-lg font-semibold transition-all duration-200
                        ${hasCustomLabel ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'}
                        ${isClaimed ? 'bg-gray-900/50 text-gray-600 cursor-not-allowed relative overflow-hidden' : ''}
                        ${!isClaimed && !isSelected ? 'bg-background border-2 border-border text-text-primary hover:border-primary hover:bg-primary/10 active:scale-95' : ''}
                        ${isSelected ? 'bg-primary text-white ring-2 ring-primary ring-offset-2 ring-offset-surface scale-105 shadow-lg' : ''}
                        flex flex-col items-center justify-center gap-0.5
                        touch-manipulation
                      `}
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                      {isClaimed && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                      )}
                      {!isClaimed && (
                        <>
                          {hasCustomLabel ? (
                            <>
                              <span className="text-[10px] sm:text-xs text-current opacity-60">#{spotNumber}</span>
                              <span className="font-bold leading-tight text-center break-words">{spotLabel}</span>
                            </>
                          ) : (
                            <span className="text-lg font-bold">{spotNumber}</span>
                          )}
                          <span className={`text-[10px] sm:text-xs font-semibold ${hasCustomPrice ? 'text-yellow-400' : 'opacity-70'}`}>
                            ${spotPrice.toFixed(2)}
                          </span>
                        </>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Selection Summary */}
              <div className="space-y-4">
                <div className="flex justify-between text-text-secondary">
                  <span>Selected Spots:</span>
                  <span className="font-semibold text-text-primary">
                    {selectedSpots.length === 0 ? 'None' : selectedSpots.sort((a, b) => a - b).join(', ')}
                  </span>
                </div>

                <div className="flex justify-between text-lg font-bold">
                  <span className="text-text-primary">Total:</span>
                  <span className="text-primary">${totalPrice.toFixed(2)}</span>
                </div>

                {/* Local Pickup Option */}
                <div className="bg-background border border-border rounded-lg p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={holdForPickup}
                      onChange={(e) => setHoldForPickup(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-0"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-text-primary">Hold for Local Pickup</div>
                      <div className="text-sm text-text-secondary mt-1">
                        Skip shipping charge. Cards will be held for you to pick up or ship later.
                      </div>
                    </div>
                  </label>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={selectedSpots.length === 0 || checkingOut}
                  className="w-full bg-primary text-white min-h-[44px] sm:min-h-[48px] py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg hover:opacity-90 active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg touch-manipulation"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  {checkingOut ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    `Checkout ${selectedSpots.length > 0 ? `(${selectedSpots.length} ${selectedSpots.length === 1 ? 'Spot' : 'Spots'})` : ''}`
                  )}
                </button>

                <p className="text-xs text-text-muted text-center">
                  Secure checkout powered by Stripe
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
