import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

/**
 * On-demand revalidation webhook, called by the admin app after a content change.
 * Secured by a shared secret.
 */
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  let body: { secret?: string; paths?: string[] };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid body" }, { status: 400 });
  }

  if (!secret || body.secret !== secret) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const paths = Array.isArray(body.paths) ? body.paths : [];
  for (const p of paths) {
    if (typeof p === "string" && p.startsWith("/")) revalidatePath(p);
  }

  return NextResponse.json({ ok: true, revalidated: paths });
}
