import { createFileRoute } from "@tanstack/react-router";

const serveMedia = async ({ params, request }: { params: { _splat?: string }; request: Request }) => {
  const objectPath = params._splat ?? "";
  if (!objectPath || objectPath.includes("..")) {
    return new Response("Not found", { status: 404 });
  }

  const base = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_SERVICE_ROLE_KEY"];
  if (!base || !key) return new Response("Not configured", { status: 500 });

  const encoded = objectPath.split("/").map(encodeURIComponent).join("/");
  const upstream = await fetch(`${base}/storage/v1/object/media/${encoded}`, {
    method: request.method === "HEAD" ? "HEAD" : "GET",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
  });

  if (!upstream.ok) {
    return new Response("Not found", { status: upstream.status === 404 ? 404 : 502 });
  }

  const headers = new Headers();
  headers.set("Content-Type", upstream.headers.get("content-type") ?? "application/octet-stream");
  const len = upstream.headers.get("content-length");
  if (len) headers.set("Content-Length", len);
  const etag = upstream.headers.get("etag");
  if (etag) headers.set("ETag", etag);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");

  return new Response(request.method === "HEAD" ? null : upstream.body, { status: 200, headers });
};

export const Route = createFileRoute("/api/public/media/$")({
  server: {
    handlers: {
      GET: serveMedia,
      HEAD: serveMedia,
    },
  },
});
