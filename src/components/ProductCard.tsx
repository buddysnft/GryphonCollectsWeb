import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/types";
import Badge from "./Badge";

interface ProductCardProps {
  product: Product;
}

// Helper to ensure Firebase Storage URLs are in the correct format
function normalizeImageUrl(url: string): string {
  try {
    // If URL already has the correct format, return as-is
    if (url.includes('alt=media') && !url.includes('token=')) {
      return url;
    }
    
    // Extract storage path from URL
    const match = url.match(/\/o\/([^?]+)/);
    if (match) {
      const encodedPath = match[1];
      return `https://firebasestorage.googleapis.com/v0/b/gryphon-breaks.firebasestorage.app/o/${encodedPath}?alt=media`;
    }
    
    // If URL format is unexpected, return original (will fall back to placeholder)
    return url;
  } catch {
    return url;
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const hasImage = product.imageURLs && product.imageURLs.length > 0;
  const imageUrl = hasImage ? normalizeImageUrl(product.imageURLs[0]) : '';
  const isOnSale = product.originalPrice !== null && product.originalPrice > product.price;
  const isSoldOut = product.quantity === 0;

  return (
    <Link href={`/shop/${product.id}`}>
      <div className="bg-surface border border-border rounded-lg overflow-hidden hover:border-primary transition group">
        {/* Image */}
        <div className="relative aspect-square bg-background">
          {hasImage ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition"
              loading="lazy"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg
                className="w-20 h-20 text-text-muted"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            <Badge variant="primary">{product.category.toUpperCase()}</Badge>
            {product.gradeCompany && product.gradeValue && (
              <Badge variant="primary">
                {product.gradeCompany} {product.gradeValue}
              </Badge>
            )}
          </div>

          {isOnSale && (
            <div className="absolute top-2 right-2">
              <Badge variant="danger">SALE</Badge>
            </div>
          )}

          {isSoldOut && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <span className="text-danger font-bold text-xl">SOLD OUT</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-text-primary font-semibold mb-1 line-clamp-2 group-hover:text-primary transition">
            {product.name}
          </h3>

          {(product.player || product.team) && (
            <p className="text-text-secondary text-sm mb-2">
              {product.player && product.team
                ? `${product.player} · ${product.team}`
                : product.player || product.team}
            </p>
          )}

          {product.brand && product.year && (
            <p className="text-text-muted text-xs mb-3">
              {product.brand} · {product.year}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div>
              {isOnSale ? (
                <div className="flex items-center gap-2">
                  <span className="text-primary font-bold text-lg">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-text-muted text-sm line-through">
                    ${product.originalPrice?.toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="text-primary font-bold text-lg">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            {!isSoldOut && (
              <span className="text-text-secondary text-xs">
                {product.quantity} in stock
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
