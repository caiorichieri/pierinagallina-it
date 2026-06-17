export const SITE_URL = "https://piergiorgioiacuzzo.it";

export function canonical(path: string) {
  return [
    { rel: "canonical" as const, href: `${SITE_URL}${path}` },
  ];
}

export function ogUrl(path: string) {
  return { property: "og:url", content: `${SITE_URL}${path}` };
}
