type RateLimitData = {
    count: number;
    resetTime: number;
};

const rateLimitStore = new Map<string, RateLimitData>();

export function rateLimit(ip: string, limit: number = 5, windowMs: number = 15 * 60 * 1000) {
    const now = Date.now();
    const currentData = rateLimitStore.get(ip);

    if (!currentData || currentData.resetTime < now) {
        rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
        return true; // OK
    }

    if (currentData.count >= limit) {
        return false; // Rate limited
    }

    currentData.count += 1;
    return true; // OK
}
