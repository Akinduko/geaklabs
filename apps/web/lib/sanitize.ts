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
