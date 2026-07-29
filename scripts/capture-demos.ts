/**
 * Capture demo GIFs for all transitions using Puppeteer + ffmpeg.
 *
 * Prerequisites:
 *   npm install --save-dev puppeteer
 *   Install ffmpeg: https://ffmpeg.org/download.html
 *     Windows (winget): winget install "FFmpeg (Essentials Build)"
 *     macOS (homebrew):  brew install ffmpeg
 *     Linux:            sudo apt install ffmpeg
 *
 * Usage:
 *   1. Start dev server: npm run dev
 *   2. Run this:        npx tsx scripts/capture-demos.ts
 *
 * Output: public/demos/{slug}.gif
 */

import { transitions } from "../src/data/transitions";
import puppeteer from "puppeteer";
import { execSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  rmSync,
  writeFileSync,
  statSync,
} from "node:fs";
import { request } from "node:http";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "public", "demos");
const FRAMES_DIR = join(__dirname, "..", "public", "demos", ".frames");
const BASE_URL = "http://localhost:3000/transition";

const FPS = 20;
const CAPTURE_PAD_MS = 300;

function ensureDir(dir: string) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function slugify(slug: string) {
  return slug.replace(/[^a-z0-9-]/g, "");
}

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function waitForServer(url: string, timeoutMs = 15000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      await new Promise<void>((resolve, reject) => {
        const req = request(url, { method: "HEAD" }, (res) => {
          if (res.statusCode === 200 || res.statusCode === 304) resolve();
          else reject(new Error(`Status ${res.statusCode}`));
        });
        req.on("error", reject);
        req.setTimeout(2000, () => { req.destroy(); reject(new Error("timeout")); });
        req.end();
      });
      return;
    } catch {
      await sleep(500);
    }
  }
  throw new Error(`Server at ${url} not reachable after ${timeoutMs}ms. Run 'npm run dev' first.`);
}

async function main() {
  ensureDir(OUT_DIR);

  // Check dev server is running
  await waitForServer("http://localhost:3000");

  // Skip transitions that won't capture well (external GIF sources)
  const skipSlugs = new Set(["gif-frog", "gif-penguin", "gif-cat"]);

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 800, height: 600 },
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();

    for (const t of transitions) {
      if (skipSlugs.has(t.slug)) {
        console.log(`  ⏭  ${t.slug} (external GIF)`);
        continue;
      }

      const slug = slugify(t.slug);
      const isTheme = t.type === "theme";
      const durationMs = t.config.duration;
      const captureMs = durationMs + CAPTURE_PAD_MS;
      const totalFrames = Math.ceil((captureMs / 1000) * FPS);
      const frameIntervalMs = captureMs / totalFrames;

      // Clean frames directory
      if (existsSync(FRAMES_DIR)) rmSync(FRAMES_DIR, { recursive: true });
      ensureDir(FRAMES_DIR);

      console.log(`\n🎬 ${slug} (${t.type}, ${durationMs}ms, ${totalFrames}f)`);

      // Navigate to playground
      await page.goto(`${BASE_URL}/${slug}`, {
        waitUntil: "domcontentloaded",
        timeout: 10000,
      });
      await page.waitForSelector("button", { timeout: 5000 });
      await sleep(600);

      // Capture pre-transition frames (a few for context)
      for (let i = 0; i < 3; i++) {
        const buf = await page.screenshot({ type: "png" });
        const framePath = join(FRAMES_DIR, `frame-${String(i).padStart(4, "0")}.png`);
        writeFileSync(framePath, buf);
        await sleep(frameIntervalMs);
      }

      // Trigger the transition
      try {
        if (isTheme) {
          // Click header theme toggle
          const toggle = await page.$('[aria-label="Toggle theme"]');
          if (toggle) await toggle.click();
          else console.log("    ⚠  Theme toggle not found");
        } else {
          // Click the "Settings" link/button in MockSite
          const links = await page.$$("nav a, button a, [role=tab]");
          let clicked = false;
          for (const link of links) {
            const text = await page.evaluate((el) => el.textContent?.toLowerCase() ?? "", link);
            if (text.includes("settings")) {
              await link.click();
              clicked = true;
              break;
            }
          }
          if (!clicked) console.log("    ⚠  Settings link not found");
        }
      } catch (e) {
        console.log(`    ⚠  Trigger failed: ${e}`);
        continue;
      }

      // Capture transition frames
      const startOffset = 3;
      for (let i = 0; i < totalFrames; i++) {
        const buf = await page.screenshot({ type: "png" });
        const framePath = join(
          FRAMES_DIR,
          `frame-${String(i + startOffset).padStart(4, "0")}.png`,
        );
        writeFileSync(framePath, buf);
        await sleep(frameIntervalMs);
      }

      // Capture post-transition frames
      for (let i = 0; i < 3; i++) {
        const buf = await page.screenshot({ type: "png" });
        const framePath = join(
          FRAMES_DIR,
          `frame-${String(totalFrames + startOffset + i).padStart(4, "0")}.png`,
        );
        writeFileSync(framePath, buf);
        await sleep(200);
      }

      // Use ffmpeg to create GIF
      const outPath = join(OUT_DIR, `${slug}.gif`);
      const palettePath = join(FRAMES_DIR, "palette.png");

      try {
        // Generate optimized palette
        execSync(
          `ffmpeg -y -framerate ${FPS} -i "${FRAMES_DIR}/frame-%04d.png" ` +
            `-vf "fps=${FPS},scale=800:-1:flags=lanczos,palettegen=stats_mode=diff" ` +
            `"${palettePath}"`,
          { stdio: "ignore", timeout: 30000 },
        );

        // Create GIF with palette
        execSync(
          `ffmpeg -y -framerate ${FPS} -i "${FRAMES_DIR}/frame-%04d.png" ` +
            `-i "${palettePath}" -lavfi "fps=${FPS},scale=800:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer" ` +
            `"${outPath}"`,
          { stdio: "ignore", timeout: 30000 },
        );

        const size = statSync(outPath).size;
        const sizeKb = (size / 1024).toFixed(1);
        console.log(`    ✅ ${slug}.gif (${sizeKb}KB)`);
      } catch (e) {
        console.log(`    ⚠  ffmpeg failed for ${slug}: ${e}`);
      }
    }
  } finally {
    await browser.close();
  }

  // Cleanup
  if (existsSync(FRAMES_DIR)) rmSync(FRAMES_DIR, { recursive: true });

  console.log("\n✨ Done! GIFs saved to public/demos/");
  console.log("   Add them to TransitionCard previews with previewGif: slug");
}

main().catch(console.error);
