/**
 * Client-side rate limiting utility
 * For server-side rate limiting, implement in API routes or Cloud Functions
 */

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();

  /**
   * Check if a request should be allowed
   * @param key - Unique identifier (e.g., userId, email, IP)
   * @param config - Rate limit configuration
   * @returns true if allowed, false if rate limit exceeded
   */
  check(key: string, config: RateLimitConfig): boolean {
    const now = Date.now();
    const entry = this.limits.get(key);

    // Clean up expired entries periodically
    this.cleanup(now);

    // No previous requests
    if (!entry) {
      this.limits.set(key, {
        count: 1,
        resetTime: now + config.windowMs,
      });
      return true;
    }

    // Time window has passed, reset
    if (now >= entry.resetTime) {
      this.limits.set(key, {
        count: 1,
        resetTime: now + config.windowMs,
      });
      return true;
    }

    // Within time window, check count
    if (entry.count < config.maxRequests) {
      entry.count++;
      return true;
    }

    // Rate limit exceeded
    return false;
  }

  /**
   * Get remaining requests for a key
   */
  remaining(key: string, config: RateLimitConfig): number {
    const entry = this.limits.get(key);
    if (!entry || Date.now() >= entry.resetTime) {
      return config.maxRequests;
    }
    return Math.max(0, config.maxRequests - entry.count);
  }

  /**
   * Get time until reset (in ms)
   */
  timeUntilReset(key: string): number {
    const entry = this.limits.get(key);
    if (!entry) return 0;
    return Math.max(0, entry.resetTime - Date.now());
  }

  /**
   * Manually reset a key
   */
  reset(key: string): void {
    this.limits.delete(key);
  }

  /**
   * Clean up expired entries
   */
  private cleanup(now: number): void {
    // Only run cleanup occasionally
    if (Math.random() > 0.1) return;

    for (const [key, entry] of this.limits.entries()) {
      if (now >= entry.resetTime) {
        this.limits.delete(key);
      }
    }
  }
}

// Global rate limiter instance
const rateLimiter = new RateLimiter();

// Predefined rate limit configs
export const RateLimits = {
  // Auth operations
  AUTH_LOGIN: { maxRequests: 5, windowMs: 15 * 60 * 1000 }, // 5 per 15min
  AUTH_SIGNUP: { maxRequests: 3, windowMs: 60 * 60 * 1000 }, // 3 per hour
  AUTH_PASSWORD_RESET: { maxRequests: 3, windowMs: 60 * 60 * 1000 }, // 3 per hour

  // Data operations
  PROFILE_UPDATE: { maxRequests: 10, windowMs: 60 * 60 * 1000 }, // 10 per hour
  ORDER_CREATE: { maxRequests: 5, windowMs: 60 * 60 * 1000 }, // 5 per hour

  // Search/Filter
  SEARCH: { maxRequests: 30, windowMs: 60 * 1000 }, // 30 per minute

  // Contact forms
  CONTACT_FORM: { maxRequests: 3, windowMs: 60 * 60 * 1000 }, // 3 per hour
  BREAK_NOTIFICATION: { maxRequests: 10, windowMs: 60 * 60 * 1000 }, // 10 per hour

  // General API
  API_GENERAL: { maxRequests: 100, windowMs: 60 * 1000 }, // 100 per minute
} as const;

/**
 * Check rate limit for a specific action
 * @throws RateLimitError if limit exceeded
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): void {
  const allowed = rateLimiter.check(key, config);
  
  if (!allowed) {
    const timeUntilReset = rateLimiter.timeUntilReset(key);
    const minutes = Math.ceil(timeUntilReset / 60000);
    throw new Error(
      `Too many requests. Please try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`
    );
  }
}

/**
 * Get remaining requests for a key
 */
export function getRateLimitInfo(key: string, config: RateLimitConfig) {
  return {
    remaining: rateLimiter.remaining(key, config),
    resetIn: rateLimiter.timeUntilReset(key),
  };
}

/**
 * Reset rate limit for a key (use sparingly)
 */
export function resetRateLimit(key: string): void {
  rateLimiter.reset(key);
}

/**
 * HOC for rate-limited async functions
 */
export function withRateLimit<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  getKey: (...args: Parameters<T>) => string,
  config: RateLimitConfig
): T {
  return (async (...args: Parameters<T>) => {
    const key = getKey(...args);
    checkRateLimit(key, config);
    return fn(...args);
  }) as T;
}

/**
 * Example usage:
 * 
 * const sendEmail = withRateLimit(
 *   async (email: string, message: string) => { ... },
 *   (email) => `email:${email}`,
 *   RateLimits.CONTACT_FORM
 * );
 */
