import { NextResponse } from "next/server";

export async function GET() {
  const envCheck = {
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL: !!process.env.FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY: !!process.env.FIREBASE_PRIVATE_KEY,
    FIREBASE_PRIVATE_KEY_LENGTH: process.env.FIREBASE_PRIVATE_KEY?.length || 0,
    STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: !!process.env.STRIPE_WEBHOOK_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
  };

  // Show first/last few chars of private key to verify format
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  if (privateKey) {
    envCheck.privateKeyStart = privateKey.substring(0, 30);
    envCheck.privateKeyEnd = privateKey.substring(privateKey.length - 30);
  }

  return NextResponse.json(envCheck);
}
