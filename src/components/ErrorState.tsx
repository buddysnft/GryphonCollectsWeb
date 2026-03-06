/**
 * Reusable error state component
 * Shows user-friendly error messages with retry option
 */

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export default function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this content. Please try again.",
  onRetry,
  showRetry = true,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-2xl font-bold text-text-primary mb-2">{title}</h3>
        <p className="text-text-secondary mb-6">{message}</p>
        {showRetry && onRetry && (
          <button
            onClick={onRetry}
            className="bg-primary text-background px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
