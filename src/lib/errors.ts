/**
 * Centralized error handling for Gryphon Collects
 */

export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message);
    this.name = "AppError";
    
    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      details: this.details,
    };
  }
}

// Predefined error types
export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super("VALIDATION_ERROR", message, 400, details);
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication required") {
    super("AUTH_ERROR", message, 401);
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = "You don't have permission to perform this action") {
    super("AUTHORIZATION_ERROR", message, 403);
    this.name = "AuthorizationError";
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = "Resource") {
    super("NOT_FOUND", `${resource} not found`, 404);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super("CONFLICT", message, 409);
    this.name = "ConflictError";
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = "Too many requests. Please try again later.") {
    super("RATE_LIMIT_EXCEEDED", message, 429);
    this.name = "RateLimitError";
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, message?: string) {
    super(
      "EXTERNAL_SERVICE_ERROR",
      message || `${service} service is unavailable`,
      503,
      { service }
    );
    this.name = "ExternalServiceError";
  }
}

/**
 * Format Firebase auth errors into user-friendly messages
 */
export function formatAuthError(code: string): string {
  const errorMessages: Record<string, string> = {
    "auth/email-already-in-use": "An account with this email already exists",
    "auth/invalid-email": "Invalid email address",
    "auth/operation-not-allowed": "This operation is not allowed",
    "auth/weak-password": "Password should be at least 6 characters",
    "auth/user-disabled": "This account has been disabled",
    "auth/user-not-found": "No account found with this email",
    "auth/wrong-password": "Incorrect password",
    "auth/too-many-requests": "Too many failed attempts. Please try again later",
    "auth/network-request-failed": "Network error. Please check your connection",
    "auth/invalid-credential": "Invalid login credentials",
    "auth/requires-recent-login": "Please log in again to continue",
    "auth/popup-closed-by-user": "Sign-in popup was closed",
    "auth/cancelled-popup-request": "Sign-in cancelled",
  };

  return errorMessages[code] || "An error occurred. Please try again";
}

/**
 * Format Firestore errors into user-friendly messages
 */
export function formatFirestoreError(code: string): string {
  const errorMessages: Record<string, string> = {
    "permission-denied": "You don't have permission to perform this action",
    "not-found": "The requested resource was not found",
    "already-exists": "This resource already exists",
    "resource-exhausted": "Quota exceeded. Please try again later",
    "failed-precondition": "Operation cannot be performed in the current state",
    "aborted": "Operation was aborted. Please try again",
    "out-of-range": "Operation was attempted past the valid range",
    "unimplemented": "This operation is not implemented",
    "internal": "Internal server error",
    "unavailable": "Service is currently unavailable",
    "data-loss": "Unrecoverable data loss or corruption",
    "unauthenticated": "You must be signed in to perform this action",
  };

  return errorMessages[code] || "A database error occurred";
}

/**
 * Handle errors consistently across the app
 */
export function handleError(error: unknown): {
  message: string;
  code?: string;
  statusCode?: number;
} {
  // AppError instances
  if (error instanceof AppError) {
    return {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
    };
  }

  // Firebase Auth errors
  if (error && typeof error === "object" && "code" in error) {
    const code = (error as { code: string }).code;
    
    if (code.startsWith("auth/")) {
      return {
        message: formatAuthError(code),
        code,
        statusCode: 401,
      };
    }
    
    if (code.startsWith("permission-denied") || code.startsWith("failed-precondition")) {
      return {
        message: formatFirestoreError(code),
        code,
        statusCode: 403,
      };
    }
  }

  // Network errors
  if (error instanceof TypeError && error.message.includes("fetch")) {
    return {
      message: "Network error. Please check your connection",
      code: "NETWORK_ERROR",
      statusCode: 503,
    };
  }

  // Generic error
  if (error instanceof Error) {
    return {
      message: error.message || "An unexpected error occurred",
      code: "UNKNOWN_ERROR",
      statusCode: 500,
    };
  }

  // Unknown error type
  return {
    message: "An unexpected error occurred",
    code: "UNKNOWN_ERROR",
    statusCode: 500,
  };
}

/**
 * Log errors with context (integrate with monitoring service later)
 */
export function logError(
  error: unknown,
  context?: {
    user?: { uid: string; email?: string };
    action?: string;
    metadata?: Record<string, unknown>;
  }
) {
  const errorInfo = handleError(error);
  
  console.error("[ERROR]", {
    ...errorInfo,
    context,
    timestamp: new Date().toISOString(),
    stack: error instanceof Error ? error.stack : undefined,
  });

  // TODO: Send to monitoring service (Sentry, LogRocket, etc.)
  // if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  //   Sentry.captureException(error, { contexts: { custom: context } });
  // }
}

/**
 * Safe async wrapper that handles errors
 */
export async function safeAsync<T>(
  fn: () => Promise<T>,
  context?: Parameters<typeof logError>[1]
): Promise<{ success: true; data: T } | { success: false; error: ReturnType<typeof handleError> }> {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (error) {
    logError(error, context);
    return { success: false, error: handleError(error) };
  }
}
