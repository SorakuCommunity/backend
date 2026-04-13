import Redis from "ioredis";

export let redis = null;
export let REDIS_TTL = 3600;

export function initRedis() {
  if (process.env.REDIS_HOST) {
    redis = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD,
      lazyConnect: true,
    });

    redis.on("connect", () => {
      console.log("Redis connected");
    });

    redis.on("error", (err) => {
      console.warn("Redis error:", err.message);
    });

    REDIS_TTL = Number(process.env.REDIS_TTL) || 3600;
    return redis;
  }
  return null;
}

export async function cacheFetch(key, fetchFn, ttl = REDIS_TTL) {
  if (!redis) {
    return await fetchFn();
  }

  try {
    const cached = await redis.get(key);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (err) {
    console.warn("Cache read error:", err.message);
  }

  const data = await fetchFn();

  try {
    await redis.setex(key, ttl, JSON.stringify(data));
  } catch (err) {
    console.warn("Cache write error:", err.message);
  }

  return data;
}

export async function clearCache(pattern = "*") {
  if (!redis) return 0;

  let keys = [];
  let cursor = "0";

  do {
    const [newCursor, newKeys] = await redis.scan(
      cursor,
      "MATCH",
      pattern,
      "COUNT",
      100,
    );
    cursor = newCursor;
    keys = keys.concat(newKeys);
  } while (cursor !== "0");

  if (keys.length > 0) {
    return await redis.del(...keys);
  }
  return 0;
}

export async function getCacheStats() {
  if (!redis) {
    return { enabled: false };
  }

  const info = await redis.info("memory");
  const used = info.match(/used_memory_human:(\S+)/)?.[1] || "0";
  const keys = await redis.dbsize();

  return {
    enabled: true,
    keys,
    memory: used,
    ttl: REDIS_TTL,
  };
}

export default { initRedis, cacheFetch, clearCache, getCacheStats };
