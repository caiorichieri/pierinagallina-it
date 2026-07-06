import DOMPurify from "dompurify";

// SSR-safe: DOMPurify needs a DOM. On the server we return a stripped-tag fallback
// so nothing dangerous is ever emitted before hydration.
export function sanitizeHtml(dirty: string | null | undefined): string {
  const input = dirty ?? "";
  if (typeof window === "undefined") {
    // Server render: strip all tags to be safe. Client will re-render sanitized HTML on hydration.
    return input.replace(/<[^>]*>/g, "");
  }
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [
      "p", "br", "strong", "em", "b", "i", "u", "s", "code", "pre", "blockquote",
      "h1", "h2", "h3", "h4", "h5", "h6",
      "ul", "ol", "li",
      "a", "img", "figure", "figcaption",
      "hr", "span", "div",
    ],
    ALLOWED_ATTR: ["href", "title", "target", "rel", "src", "alt", "class"],
    ALLOW_DATA_ATTR: false,
  });
}
