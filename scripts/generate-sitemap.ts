/**
 * Generate sitemap.xml at build time.
 * Run: npx tsx scripts/generate-sitemap.ts
 */

import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { transitions } from "../src/data/transitions";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = "https://transition-kit.space";

const LAST_MOD = new Date().toISOString().split("T")[0];

const staticPages = [
  { path: "", priority: "1.0", changefreq: "weekly" },
  { path: "about", priority: "0.5", changefreq: "monthly" },
  { path: "components", priority: "0.9", changefreq: "weekly" },
  { path: "components/edge-cases", priority: "0.8", changefreq: "monthly" },
  { path: "components/theme/animated-theme-toggler", priority: "0.8", changefreq: "monthly" },
  { path: "components/theme/theme-toggle-button", priority: "0.8", changefreq: "monthly" },
  { path: "components/theme/theme-toggle-switch", priority: "0.8", changefreq: "monthly" },
  { path: "components/theme/theme-switcher", priority: "0.8", changefreq: "monthly" },
  { path: "templates", priority: "0.9", changefreq: "weekly" },
  { path: "templates/theme-toggles", priority: "0.7", changefreq: "weekly" },
  { path: "templates/page-transitions", priority: "0.7", changefreq: "weekly" },
];

const transitionPages = transitions.map((t) => ({
  path: `transition/${t.slug}`,
  priority: "0.6",
  changefreq: "monthly",
}));

const allPages = [...staticPages, ...transitionPages];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${BASE}/${page.path}</loc>
    <lastmod>${LAST_MOD}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

const outPath = join(__dirname, "..", "public", "sitemap.xml");
writeFileSync(outPath, xml, "utf-8");
console.log(`✅ sitemap.xml written (${allPages.length} URLs)`);
