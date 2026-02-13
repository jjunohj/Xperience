import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

type RevalidateRequestBody = {
  path?: unknown;
  tag?: unknown;
};

async function parseOptionalJsonBody(request: NextRequest): Promise<RevalidateRequestBody> {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return {};
  }

  const rawBody = await request.text();
  if (!rawBody.trim()) {
    return {};
  }

  try {
    return JSON.parse(rawBody) as RevalidateRequestBody;
  } catch {
    throw new Error("Invalid JSON body");
  }
}

export async function POST(request: NextRequest) {
  try {
    const secret = request.nextUrl.searchParams.get("secret");

    // 보안을 위한 시크릿 키 검증
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
    }

    const body = await parseOptionalJsonBody(request);
    const queryPath = request.nextUrl.searchParams.get("path");
    const queryTag = request.nextUrl.searchParams.get("tag");

    const path = typeof body.path === "string" ? body.path : queryPath;
    const tag = typeof body.tag === "string" ? body.tag : queryTag;

    // 특정 경로 재검증
    if (path) {
      revalidatePath(path);
      console.log(`Revalidated path: ${path}`);
    }

    // 특정 태그 재검증
    if (tag) {
      revalidateTag(tag);
      console.log(`Revalidated tag: ${tag}`);
    }

    // 기본적으로 노션 블로그 관련 경로들 재검증
    revalidatePath("/blog");
    revalidatePath("/api/notion/posts");

    return NextResponse.json(
      {
        revalidated: true,
        now: Date.now(),
        paths: [path, "/blog", "/api/notion/posts"].filter(Boolean),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Revalidation error:", error);
    if (error instanceof Error && error.message === "Invalid JSON body") {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    return NextResponse.json({ error: "Failed to revalidate" }, { status: 500 });
  }
}
