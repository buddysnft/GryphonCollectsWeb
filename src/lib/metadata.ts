import { Metadata } from "next";
import { brandConfig } from "@/config/brand";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gryphoncollects.com";

export function generateMetadata({
  title,
  description,
  path = "/",
  image,
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
}): Metadata {
  const fullTitle = title
    ? `${title} | ${brandConfig.businessName}`
    : `${brandConfig.businessName} - ${brandConfig.tagline}`;

  const fullDescription =
    description ||
    "Premium soccer card breaks and singles. Watch live on YouTube, Instagram, and Whatnot. Authentic products, fair breaks, and fast shipping.";

  const fullImage = image || `${siteUrl}/og-image.jpg`;
  const fullUrl = `${siteUrl}${path}`;

  return {
    title: fullTitle,
    description: fullDescription,
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url: fullUrl,
      siteName: brandConfig.businessName,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: fullDescription,
      images: [fullImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
