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
    types: {
      "application/rss+xml": [
        { url: "/rss.xml", title: "GEAK LABS — Notes" },
        { url: "/faith/rss.xml", title: copy["faith.rssTitle"] },
        { url: "/journal/rss.xml", title: copy["journal.rssTitle"] },
      ],
    },
  },
  keywords: [
    "AI",
    "AI strategy",
    "AI governance",
    "AI adoption",
    "process automation",
    "engineering",
    "leadership",
    "building",
    "faith",
    "Christian writing",
    "scripture",
    "GEAK LABS",
  ],
  authors: [{ name: "Olugbenga Akinduko" }],
  openGraph: {
    type: "website",
    siteName: "GEAK LABS",
  },
  twitter: { card: "summary_large_image" },
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
