"use client";

import posthog from "posthog-js";

/** Capture a named event; a no-op when analytics isn't configured. */
export function track(event: string, properties?: Record<string, unknown>) {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
  posthog.capture(event, properties);
}
