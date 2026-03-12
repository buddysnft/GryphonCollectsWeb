import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getSiteUrl } from "@/lib/get-site-url";

export async function POST(request: NextRequest) {
  try {
    const { breakId, spots, pricePerSpot, spotPrices, breakTitle, holdForPickup } = await request.json();

    if (!breakId || !spots || spots.length === 0 || !pricePerSpot) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Calculate total using individual spot prices if provided, otherwise use default
    let total = 0;
    if (spotPrices) {
      total = spots.reduce((sum: number, spotNum: number) => {
        return sum + (spotPrices[spotNum] || pricePerSpot);
      }, 0);
    } else {
      total = spots.length * pricePerSpot;
    }

    // Get the site URL for redirects
    const siteUrl = getSiteUrl();

    // Build checkout session configuration
    const sessionConfig: any = {
      payment_method_types: ["card", "paypal"], // Enable PayPal + Credit Card
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${breakTitle} - ${spots.length} ${spots.length === 1 ? 'Spot' : 'Spots'}`,
              description: `Spot ${spots.length === 1 ? 'number' : 'numbers'}: ${spots.sort((a: number, b: number) => a - b).join(', ')}${holdForPickup ? ' (Held for Pickup)' : ''}`,
            },
            unit_amount: Math.round(total * 100), // Total in cents
            tax_behavior: "exclusive", // Tax calculated separately
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/breaks/${breakId}`,
      
      // Automatic sales tax calculation (Virginia + all states)
      automatic_tax: {
        enabled: true,
      },
      
      // Enable saved payment methods for future purchases
      payment_intent_data: {
        setup_future_usage: "on_session", // Save card for logged-in users
      },
      
      metadata: {
        type: "break",
        breakId,
        spots: JSON.stringify(spots),
        pricePerSpot: pricePerSpot.toString(),
        holdForPickup: holdForPickup ? "true" : "false",
        ...(spotPrices && { spotPrices: JSON.stringify(spotPrices) }),
      },
    };

    // Only collect shipping if NOT holding for pickup
    if (!holdForPickup) {
      sessionConfig.shipping_address_collection = {
        allowed_countries: ["US"], // US shipping only
      };
      sessionConfig.shipping_options = [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 0, // Free shipping (Tyler uses Shippo separately)
              currency: "usd",
            },
            display_name: "Standard Shipping",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 3,
              },
              maximum: {
                unit: "business_day",
                value: 7,
              },
            },
          },
        },
      ];
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create(sessionConfig);

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Break checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
