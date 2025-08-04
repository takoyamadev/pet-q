import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let ratelimit: Ratelimit | null = null;

export function getRateLimiter() {
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    console.warn("Rate limiting is disabled: Redis credentials not configured");
    return null;
  }

  if (!ratelimit) {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "1 m"), // 1分間に10リクエストまで
      analytics: true,
      prefix: "@upstash/ratelimit",
    });
  }

  return ratelimit;
}

export async function checkRateLimit(identifier: string) {
  const limiter = getRateLimiter();

  if (!limiter) {
    // レートリミットが設定されていない場合は通過
    return { success: true, limit: 0, remaining: 0, reset: 0 };
  }

  const { success, limit, remaining, reset } = await limiter.limit(identifier);

  return { success, limit, remaining, reset };
}
