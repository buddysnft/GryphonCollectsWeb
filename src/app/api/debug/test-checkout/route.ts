import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getSiteUrl } from "@/lib/get-site-url";

/**
 * Test Stripe checkout configuration
 * Check if Stripe is properly configured and can create sessions
 */
export async function GET() {
  const results: any = {
    timestamp: new Date().toISOString(),
    stripe: {
      configured: false,
      canCreateSession: false,
      testMode: false,
    },
    environment: {
      hasPublicKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      hasSecretKey: !!process.env.STRIPE_SECRET_KEY,
      hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
      siteUrl: getSiteUrl(),
      rawSiteUrl: process.env.NEXT_PUBLIC_SITE_URL,
      rawVercelUrl: process.env.VERCEL_URL,
    },
  };

  try {
    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY not configured");
    }

    results.stripe.configured = true;

    // Test if we can create a checkout session
    try {
      const siteUrl = getSiteUrl();
      const testSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Test Product",
              },
              unit_amount: 100, // $1.00
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${siteUrl}/test`,
        cancel_url: `${siteUrl}/test`,
      });

      results.stripe.canCreateSession = true;
      results.stripe.testSessionId = testSession.id;
      results.stripe.testMode = testSession.livemode === false;
    } catch (err: any) {
      results.stripe.error = err.message;
      results.stripe.errorType = err.type;
    }

    return NextResponse.json({
      success: results.stripe.canCreateSession,
      results,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        results,
      },
      { status: 500 }
    );
  }
}
