import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename") ?? `upload-${Date.now()}`;

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Blob storage not configured. Set BLOB_READ_WRITE_TOKEN." },
      { status: 501 },
    );
  }

  if (!request.body) {
    return NextResponse.json({ error: "no file" }, { status: 400 });
  }

  const blob = await put(`geaklabs/${Date.now()}-${filename}`, request.body, {
    access: "public",
    addRandomSuffix: true,
  });

  return NextResponse.json({ url: blob.url });
}
