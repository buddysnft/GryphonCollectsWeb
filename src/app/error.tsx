"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-danger mb-4">⚠️</h1>
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            Something Went Wrong
          </h2>
          <p className="text-text-secondary mb-4">
            We encountered an unexpected error. Please try again.
          </p>
          {process.env.NODE_ENV === "development" && (
            <details className="text-left bg-surface border border-border rounded-lg p-4 mb-4">
              <summary className="cursor-pointer text-text-muted text-sm mb-2">
                Error Details (Dev Mode)
              </summary>
              <pre className="text-xs text-danger overflow-auto max-h-40">
                {error.message}
                {error.digest && `\nDigest: ${error.digest}`}
              </pre>
            </details>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="bg-primary text-background px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="bg-surface border border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-surface-hover transition"
          >
            Go Home
          </Link>
        </div>

        <div className="mt-8 text-text-muted text-sm">
          <p>If this problem persists, please contact support.</p>
        </div>
      </div>
    </div>
  );
}
