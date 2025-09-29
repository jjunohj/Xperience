import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const secret = request.nextUrl.searchParams.get("secret");

    // 보안을 위한 시크릿 키 검증
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
    }

    const body = await request.json();
    const { path, tag } = body;

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
    return NextResponse.json({ error: "Failed to revalidate" }, { status: 500 });
  }
}
