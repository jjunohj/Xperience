import { getAllPageMetadata } from "@/src/libs/notion";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const posts = await getAllPageMetadata();

    return NextResponse.json(posts, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export const revalidate = 3600; // 1시간마다 재검증
