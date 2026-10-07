"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

/**
 * Site-wide click tracking. Any element with `data-track="event_name"` (plus optional
 * `data-track-*` properties) captures that event when clicked, so server components
 * can mark up links without becoming client components.
 */
export function ClickTracking() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-track]");
      if (!el) return;
      const { track: event, ...rest } = el.dataset;
      if (!event) return;
      const props: Record<string, string> = {};
      for (const [k, v] of Object.entries(rest)) {
        if (k.startsWith("track") && v !== undefined) {
          props[k.slice(5).replace(/^[A-Z]/, (c) => c.toLowerCase())] = v;
        }
      }
      track(event, { ...props, href: el.getAttribute("href") ?? undefined, text: el.textContent?.trim().slice(0, 80) });
    }
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}

/**
 * Reading analytics for one post: `post_view` on open, `post_read_complete` once the
 * reader reaches the end of the body.
 */
export function PostAnalytics({
  post,
}: {
  post: { slug: string; title: string; section: string; category?: string | null; series?: string | null; seriesPart?: number | null; readingMinutes: number };
}) {
  useEffect(() => {
    const props = {
      slug: post.slug,
      title: post.title,
      section: post.section,
      category: post.category ?? undefined,
      series: post.series ?? undefined,
      series_part: post.seriesPart ?? undefined,
      reading_minutes: post.readingMinutes,
    };
    track("post_view", props);

    const end = document.getElementById("post-end");
    if (!end) return;
    const opened = Date.now();
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      track("post_read_complete", { ...props, seconds_on_page: Math.round((Date.now() - opened) / 1000) });
      observer.disconnect();
    });
    observer.observe(end);
    return () => observer.disconnect();
  }, [post.slug, post.title, post.section, post.category, post.series, post.seriesPart, post.readingMinutes]);
  return null;
}
