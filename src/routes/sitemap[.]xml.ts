import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { movies } from "@/lib/data";

const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticPaths = ["/", "/movies", "/web-series", "/anime", "/k-drama", "/genres", "/trending", "/search"];
        const movieUrls = movies.map((m) => `/movie/${m.id}`);
        const urls = [...staticPaths, ...movieUrls]
          .map((p) => `  <url><loc>${BASE_URL}${p}</loc><changefreq>weekly</changefreq></url>`)
          .join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
