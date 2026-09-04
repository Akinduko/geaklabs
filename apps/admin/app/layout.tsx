import type { Metadata } from "next";
import { fontVariables } from "@geaklabs/ui";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "GEAK LABS Admin",
    template: "%s · GEAK LABS Admin",
  },
  description: "Content studio for GEAK LABS.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <body className="min-h-screen bg-ink-50 font-sans text-ink-900 antialiased">{children}</body>
    </html>
  );
}
