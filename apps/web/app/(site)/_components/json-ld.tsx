/**
 * Renders a JSON-LD graph into the page. Search engines and LLM crawlers read
 * this to understand who the site is about and what each page contains.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // The payload is built server-side from our own data, never user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
