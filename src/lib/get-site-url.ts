/**
 * Get the site URL for redirects and webhooks
 * Handles various environment configurations
 */
export function getSiteUrl(): string {
  // In development
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }

  // Check NEXT_PUBLIC_SITE_URL (but validate it's actually a URL, not a Stripe key)
  const publicUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (publicUrl && (publicUrl.startsWith('http://') || publicUrl.startsWith('https://'))) {
    return publicUrl;
  }

  // Check VERCEL_URL
  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) {
    // VERCEL_URL doesn't include protocol
    return `https://${vercelUrl}`;
  }

  // Fallback to production URL
  return 'https://gryphon-collects-web-jswr.vercel.app';
}
