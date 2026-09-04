import type { Metadata } from "next";
import { fontVariables } from "@geaklabs/ui";
import { getSiteCopy } from "@geaklabs/db";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getSiteCopy();
  return {
  metadataBase: new URL(SITE_URL),
  title: {
    default: copy["meta.title"],
    template: "%s · GEAK LABS",
  },
  description: copy["meta.description"],
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": [{ url: "/rss.xml", title: "GEAK LABS" }] },
  },
  keywords: ["AI", "AI strategy", "AI governance", "AI adoption", "process automation", "leadership", "management", "technology", "GEAK LABS"],
  authors: [{ name: "Olugbenga Akinduko" }],
  openGraph: {
    type: "website",
    siteName: "GEAK LABS",
    url: SITE_URL,
  },
  twitter: { card: "summary_large_image", creator: "@geaklabs" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  icons: {
    icon: [{ url: "/brand/favicon.ico" }, { url: "/icon.svg", type: "image/svg+xml" }],
  },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <body className="min-h-screen bg-paper font-sans text-ink-900 antialiased">{children}</body>
    </html>
  );
}
