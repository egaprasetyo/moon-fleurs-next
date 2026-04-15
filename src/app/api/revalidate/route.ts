import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

type RevalidateBody = {
  path?: string;
};

export async function POST(request: NextRequest) {
  const requestSecret =
    request.nextUrl.searchParams.get("secret") ||
    request.headers.get("x-revalidate-secret");
  const expectedSecret = process.env.REVALIDATE_SECRET;

  if (!expectedSecret || requestSecret !== expectedSecret) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as RevalidateBody;
  const path = body.path && body.path.startsWith("/") ? body.path : "/";

  revalidatePath(path);

  return NextResponse.json({
    revalidated: true,
    path,
    timestamp: new Date().toISOString(),
  });
}
