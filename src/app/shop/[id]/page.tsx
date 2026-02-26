"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { getProduct, getProducts } from "@/lib/firestore";
import { where, limit as limitQuery } from "firebase/firestore";
import { addToCart } from "@/lib/cart";
import type { Product } from "@/lib/types";
import Badge from "@/components/Badge";
import ProductCard from "@/components/ProductCard";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (params.id) {
      loadProduct(params.id as string);
    }
  }, [params.id]);

  const loadProduct = async (id: string) => {
    try {
      const fetchedProduct = await getProduct(id);
      if (fetchedProduct) {
        setProduct(fetchedProduct);
        
        // Load related products (same category)
        const related = await getProducts([
          where("category", "==", fetchedProduct.category),
          where("isActive", "==", true),
          limitQuery(4),
        ]);
        setRelatedProducts(related.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error("Error loading product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    setAddingToCart(true);
    addToCart({
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity,
      imageURL: product.imageURLs[0] || undefined,
    });

    setTimeout(() => {
      setAddingToCart(false);
      router.push("/cart");
    }, 500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-secondary">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-secondary text-lg mb-4">Product not found</p>
          <button
            onClick={() => router.push("/shop")}
            className="text-primary hover:underline"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const hasImage = product.imageURLs && product.imageURLs.length > 0;
  const isOnSale = product.originalPrice !== null && product.originalPrice > product.price;
  const isSoldOut = product.quantity === 0;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="text-text-secondary hover:text-primary mb-6 flex items-center gap-2"
        >
          ← Back
        </button>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image */}
          <div className="relative aspect-square bg-surface rounded-lg overflow-hidden">
            {hasImage ? (
              <Image
                src={product.imageURLs[0]}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg
                  className="w-32 h-32 text-text-muted"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="primary">{product.category}</Badge>
              {product.gradeCompany && product.gradeValue && (
                <Badge variant="primary">
                  {product.gradeCompany} {product.gradeValue}
                </Badge>
              )}
              {isOnSale && <Badge variant="danger">SALE</Badge>}
              {isSoldOut && <Badge variant="danger">SOLD OUT</Badge>}
            </div>

            <h1 className="text-3xl font-bold text-text-primary mb-4">
              {product.name}
            </h1>

            {(product.player || product.team) && (
              <p className="text-text-secondary text-lg mb-4">
                {product.player && product.team
                  ? `${product.player} · ${product.team}`
                  : product.player || product.team}
              </p>
            )}

            {product.brand && product.year && (
              <p className="text-text-muted mb-6">
                {product.brand} · {product.year}
              </p>
            )}

            {/* Price */}
            <div className="mb-6">
              {isOnSale ? (
                <div className="flex items-center gap-3">
                  <span className="text-primary font-bold text-3xl">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-text-muted text-xl line-through">
                    ${product.originalPrice?.toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="text-primary font-bold text-3xl">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <p className="text-text-secondary leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quantity Selector */}
            {!isSoldOut && (
              <div className="mb-6">
                <label className="block text-text-secondary mb-2">Quantity</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="bg-surface border border-border w-10 h-10 rounded-lg hover:border-primary transition"
                  >
                    -
                  </button>
                  <span className="text-text-primary font-semibold text-lg w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                    className="bg-surface border border-border w-10 h-10 rounded-lg hover:border-primary transition"
                  >
                    +
                  </button>
                  <span className="text-text-muted text-sm">
                    ({product.quantity} available)
                  </span>
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={isSoldOut || addingToCart}
              className="w-full bg-primary text-background py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {addingToCart ? "Adding..." : isSoldOut ? "Sold Out" : "Add to Cart"}
            </button>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-primary mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((related) => (
                <ProductCard key={related.id} product={related} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
