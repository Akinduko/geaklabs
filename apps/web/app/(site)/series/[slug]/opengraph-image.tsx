import { getSeriesBySlug } from "@geaklabs/db";
import { socialCard } from "@/lib/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/jpeg";
export const revalidate = 3600;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = await getSeriesBySlug(slug);
  return socialCard({
    title: s?.name ?? "Series",
    kicker: "Series",
    coverImageUrl: s?.coverImageUrl ?? null,
    seed: `series:${slug}`,
  });
}
