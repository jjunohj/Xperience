import { Redis } from "@upstash/redis";

let client: Redis | null = null;

export function getRedis(): Redis {
  if (!client) {
    const url = process.env.UPSTASH_REDIS_REST_KV_REST_API_URL;
    const token = process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN;
    if (!url || !token) {
      throw new Error("Missing Upstash Redis env vars (UPSTASH_REDIS_REST_KV_REST_API_URL / _TOKEN)");
    }
    client = new Redis({ url, token });
  }
  return client;
}
