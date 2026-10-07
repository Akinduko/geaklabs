import posthog from "posthog-js";

/**
 * Client analytics (PostHog). Runs once before hydration on every page load.
 * Events go through the site's own domain (see the rewrites in next.config.ts)
 * so ad blockers don't drop them. Does nothing until NEXT_PUBLIC_POSTHOG_KEY is set.
 */
const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;

if (key) {
  posthog.init(key, {
    api_host: "/pgst",
    ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.posthog.com",
    defaults: "2025-05-24",
    capture_pageview: "history_change",
    capture_pageleave: true,
    person_profiles: "identified_only",
  });
}
