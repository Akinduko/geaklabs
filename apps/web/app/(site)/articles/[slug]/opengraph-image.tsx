import { postOgImage } from "../../_components/post-og-image";

export const size = { width: 1200, height: 630 };
export const contentType = "image/jpeg";
export const revalidate = 3600;

export default function Image({ params }: { params: Promise<{ slug: string }> }) {
  return postOgImage(params, "professional");
}
