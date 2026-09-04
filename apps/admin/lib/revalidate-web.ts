/**
 * Ping the public web app to revalidate paths after a content change.
 * The web app and admin app are separate deployments sharing one database,
 * so on-demand revalidation goes over a secured webhook.
 */
export async function revalidateWeb(paths: string[]) {
  const base = process.env.NEXT_PUBLIC_SITE_URL;
  const secret = process.env.REVALIDATE_SECRET;
  if (!base || !secret) return;

  try {
    await fetch(`${base}/api/revalidate`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ secret, paths }),
      // Never let a revalidation hiccup break the admin action.
      cache: "no-store",
    });
  } catch {
    // Non-fatal: ISR will refresh within its window regardless.
  }
}
