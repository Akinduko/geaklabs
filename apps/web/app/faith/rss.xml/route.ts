import { buildFeed } from "@/lib/rss";

export const revalidate = 300;

export function GET() {
  return buildFeed("faith");
}
