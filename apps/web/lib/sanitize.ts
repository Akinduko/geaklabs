import sanitizeHtml from "sanitize-html";

/**
 * Sanitize admin-authored article HTML before rendering.
 * Content is authored by a trusted single admin, but we sanitize defensively
 * so a compromised session or bad paste can never inject scripts.
 */
export function sanitizeArticleHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "h2", "h3", "h4", "p", "a", "ul", "ol", "li", "blockquote", "strong",
      "em", "code", "pre", "br", "hr", "img", "figure", "figcaption", "span",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "width", "height"],
      span: ["class"],
    },
    allowedSchemes: ["https", "http", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }),
    },
  });
}

/**
 * Editorial touches applied after sanitizing (so the output is already trusted):
 * up to two long, fully-bold paragraphs become pull quotes. Short bold lines
 * ("Wait.") are left alone so a run of them doesn't stack into a wall of quotes.
 */
export function decorateArticleHtml(html: string, { maxPulls = 2, minLength = 30 } = {}): string {
  let pulls = 0;
  return html.replace(/<p><strong>([^<]+)<\/strong><\/p>/g, (match, text: string) => {
    if (pulls >= maxPulls || text.trim().length < minLength) return match;
    pulls++;
    return `<p class="pull"><strong>${text}</strong></p>`;
  });
}
