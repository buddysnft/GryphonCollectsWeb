import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const { breakId, spots, pricePerSpot, breakTitle } = await request.json();

    if (!breakId || !spots || spots.length === 0 || !pricePerSpot) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Calculate total
    const total = spots.length * pricePerSpot;

    // Get the site URL for redirects
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${breakTitle} - ${spots.length} ${spots.length === 1 ? 'Spot' : 'Spots'}`,
              description: `Spot ${spots.length === 1 ? 'number' : 'numbers'}: ${spots.sort((a: number, b: number) => a - b).join(', ')}`,
            },
            unit_amount: Math.round(total * 100), // Total in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/breaks/${breakId}`,
      metadata: {
        type: "break",
        breakId,
        spots: JSON.stringify(spots),
        pricePerSpot: pricePerSpot.toString(),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Break checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
