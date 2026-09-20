import { createFileRoute } from "@tanstack/react-router";

const PATHS = [
  { path: "/", priority: "1.0" },
  { path: "/exchange", priority: "0.9" },
  { path: "/materials", priority: "0.9" },
  { path: "/security", priority: "0.8" },
  { path: "/pricing", priority: "0.8" },
  { path: "/about", priority: "0.6" },
  { path: "/resources", priority: "0.7" },
  { path: "/faq", priority: "0.6" },
  { path: "/contact", priority: "0.7" },
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const origin = new URL(request.url).origin;
        const lastmod = new Date().toISOString().slice(0, 10);
        const urls = PATHS.map(
          (p) =>
            `  <url><loc>${origin}${p.path}</loc><lastmod>${lastmod}</lastmod><priority>${p.priority}</priority></url>`,
        ).join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
        return new Response(xml, {
          headers: { "content-type": "application/xml; charset=utf-8" },
        });
      },
    },
  },
});
