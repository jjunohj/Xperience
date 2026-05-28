import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "~/libs/redis";

const TOTAL_KEY = "visits:total";
const COOKIE_NAME = "xp_visitor_id";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24;
const DAILY_KEY_TTL_SECONDS = 60 * 60 * 24 * 7;

function getKstDate(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" }).format(new Date());
}

function dailyKey(date: string): string {
  return `visits:daily:${date}`;
}

function noStoreJson(body: unknown) {
  return NextResponse.json(body, { headers: { "Cache-Control": "no-store" } });
}

export async function GET() {
  try {
    const redis = getRedis();
    const today = getKstDate();
    const [total, todayCount] = await Promise.all([redis.get<number>(TOTAL_KEY), redis.get<number>(dailyKey(today))]);
    return noStoreJson({ total: total ?? 0, today: todayCount ?? 0 });
  } catch {
    return NextResponse.json({ error: "redis_unavailable" }, { status: 503 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const redis = getRedis();
    const today = getKstDate();
    const todayKey = dailyKey(today);
    const existingVisitor = req.cookies.get(COOKIE_NAME)?.value;
    const isNewVisitor = !existingVisitor;

    let total: number;
    let todayCount: number;

    if (isNewVisitor) {
      [total, todayCount] = await Promise.all([redis.incr(TOTAL_KEY), redis.incr(todayKey)]);
      await redis.expire(todayKey, DAILY_KEY_TTL_SECONDS);
    } else {
      const [t, d] = await Promise.all([redis.get<number>(TOTAL_KEY), redis.get<number>(todayKey)]);
      total = t ?? 0;
      todayCount = d ?? 0;
    }

    const res = noStoreJson({ total, today: todayCount });

    if (isNewVisitor) {
      res.cookies.set(COOKIE_NAME, crypto.randomUUID(), {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: COOKIE_MAX_AGE_SECONDS,
        path: "/",
      });
    }

    return res;
  } catch {
    return NextResponse.json({ error: "redis_unavailable" }, { status: 503 });
  }
}
