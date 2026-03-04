import Link from "next/link";
import Image from "next/image";
import type { Break } from "@/lib/types";
import Badge from "./Badge";

interface BreakCardProps {
  breakData: Break;
}

export default function BreakCard({ breakData }: BreakCardProps) {
  const spotsRemaining = breakData.totalSpots - breakData.claimedSpots;
  const progressPercent = (breakData.claimedSpots / breakData.totalSpots) * 100;
  const hasImage = breakData.imageURL !== null;

  const formatDate = (timestamp: any) => {
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <Link href={`/breaks/${breakData.id}`}>
      <div className="bg-surface border border-border rounded-lg overflow-hidden hover:border-primary transition group">
        {/* Image */}
        <div className="relative aspect-video bg-background">
          {hasImage ? (
            <Image
              src={breakData.imageURL!}
              alt={breakData.title}
              fill
              className="object-cover group-hover:scale-105 transition"
              loading="lazy"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg
                className="w-16 h-16 text-text-muted"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {/* Format Badge */}
          <div className="absolute top-2 left-2">
            <Badge variant="primary">{breakData.breakFormat}</Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-text-primary font-semibold mb-2 line-clamp-2 group-hover:text-primary transition">
            {breakData.title}
          </h3>

          <div className="flex items-center justify-between text-sm mb-3">
            <span className="text-text-secondary">{formatDate(breakData.date)}</span>
            <span className="text-primary font-bold">
              ${breakData.pricePerSpot.toFixed(2)}/spot
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mb-2">
            <div className="flex justify-between text-xs text-text-secondary mb-1">
              <span>{breakData.claimedSpots} claimed</span>
              <span>{spotsRemaining} remaining</span>
            </div>
            <div className="h-2 bg-background rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {spotsRemaining === 0 && (
            <div className="text-center py-2">
              <Badge variant="danger">FULL</Badge>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
