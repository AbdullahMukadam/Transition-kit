import { Globe, Loader2, Shrink, Expand, Zap } from "lucide-react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  CodeBlock,
  CodeBlockBody,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockItem,
} from "#/components/kibo-ui/code-block";
import { EMBED_MESSAGE_SOURCE, buildEmbedSnippet } from "#/lib/embed";
import { cn } from "#/lib/utils";

export interface EmbedPreviewHandle {
  trigger: () => void;
}

interface EmbedPreviewProps {
  css: string;
  kind: "theme" | "page";
}

const SNIPPET_TABS: {
  language: string;
  filename: string;
  code: string;
  highlightLang: "html" | "tsx";
}[] = [
  {
    language: "script",
    filename: "Script Tag",
    highlightLang: "html",
    code: `<script
  crossOrigin="anonymous"
  src="https://transition-kit.space/live-preview.min.js"
></script>`,
  },
  {
    language: "nextjs-app",
    filename: "Next.js (App)",
    highlightLang: "tsx",
    code: `// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          async
          crossOrigin="anonymous"
          src="https://transition-kit.space/live-preview.min.js"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}`,
  },
  {
    language: "nextjs-pages",
    filename: "Next.js (Pages)",
    highlightLang: "tsx",
    code: `// pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script
          async
          crossOrigin="anonymous"
          src="https://transition-kit.space/live-preview.min.js"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}`,
  },
  {
    language: "vite",
    filename: "Vite",
    highlightLang: "html",
    code: `<!-- index.html -->
<!doctype html>
<html lang="en">
  <head>
    <script
      crossOrigin="anonymous"
      src="https://transition-kit.space/live-preview.min.js"
    />
  </head>
  <body>
    <!-- ... -->
  </body>
</html>`,
  },
  {
    language: "remix",
    filename: "Remix",
    highlightLang: "tsx",
    code: `// app/root.tsx
import { Links, Meta, Outlet, Scripts } from "@remix-run/react";

export default function App() {
  return (
    <html>
      <head>
        <link
          rel="icon"
          href="data:image/x-icon;base64,AA"
        />
        <Meta />
        <script
          crossOrigin="anonymous"
          src="https://transition-kit.space/live-preview.min.js"
        />
        <Links />
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}`,
  },
];

function toHttps(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export const EmbedPreview = forwardRef<EmbedPreviewHandle, EmbedPreviewProps>(
  function EmbedPreview({ css, kind }, ref) {
    const [url, setUrl] = useState("");
    const [loadedUrl, setLoadedUrl] = useState("");
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [triggered, setTriggered] = useState(false);
    const [snippetReady, setSnippetReady] = useState(false);
    const [lastApplied, setLastApplied] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [snippetTab, setSnippetTab] = useState(SNIPPET_TABS[0].language);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const frameRef = useRef<HTMLDivElement>(null);
    const appliedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
      return () => {
        if (appliedTimerRef.current) clearTimeout(appliedTimerRef.current);
      };
    }, []);

    useEffect(() => {
      const onFullscreenChange = () =>
        setIsFullscreen(!!document.fullscreenElement);
      document.addEventListener("fullscreenchange", onFullscreenChange);
      return () =>
        document.removeEventListener("fullscreenchange", onFullscreenChange);
    }, []);

    useEffect(() => {
      const onMessage = (event: MessageEvent) => {
        const iframe = iframeRef.current;
        if (!iframe || event.source !== iframe.contentWindow) return;
        const msg = event.data;
        if (!msg || msg.source !== EMBED_MESSAGE_SOURCE) return;
        if (msg.type === "ready") {
          setSnippetReady(true);
        } else if (msg.type === "applied") {
          setLastApplied(Date.now());
          setTriggered(false);
        }
      };
      window.addEventListener("message", onMessage);
      return () => window.removeEventListener("message", onMessage);
    }, []);

    const trigger = useCallback(() => {
      const iframe = iframeRef.current;
      if (!iframe?.contentWindow || !loadedUrl) return;
      setLastApplied(0);
      setSnippetReady(true);
      const message = {
        source: EMBED_MESSAGE_SOURCE,
        type: "trigger",
        kind,
        css,
      };
      iframe.contentWindow.postMessage(message, "*");
      setTriggered(true);
      if (appliedTimerRef.current) clearTimeout(appliedTimerRef.current);
      appliedTimerRef.current = setTimeout(() => {
        setTriggered(false);
      }, 1500);
    }, [css, kind, loadedUrl]);

    useImperativeHandle(ref, () => ({
      trigger,
    }));

    const toggleFullscreen = () => {
      if (document.fullscreenElement) {
        void document.exitFullscreen();
      } else if (frameRef.current) {
        void frameRef.current.requestFullscreen();
      }
    };

    const handleLoad = () => {
      const normalized = toHttps(url);
      const loaded = toHttps(loadedUrl);
      if (normalized === loaded) setLoaded(true);
    };

    const handleError = () => {
      setError("Couldn't load that site. Check the URL and try again.");
    };

    const load = () => {
      const normalized = toHttps(url);
      if (!normalized) return;
      setError(null);
      setLoaded(false);
      setSnippetReady(false);
      setLoadedUrl(normalized);
    };

    const status = loadedUrl
      ? loaded
        ? snippetReady
          ? lastApplied
            ? "Transition applied"
            : "Snippet detected"
          : "Snippet not detected"
        : "Loading"
      : "Not loaded";

    return (
      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)] shadow-sm">
        {/* URL bar */}
        <div className="flex flex-col gap-2 border-b border-[var(--border)] bg-[var(--muted)]/20 px-3 py-3 sm:flex-row sm:items-center">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <Globe className="size-4 shrink-0 text-[var(--muted-foreground)]" />
            <input
              type="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") load();
              }}
              placeholder="https://your-site.com"
              aria-label="Your site URL"
              className="h-9 min-w-0 flex-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]/70 focus:border-[var(--accent)]/60"
            />
            <button
              type="button"
              onClick={load}
              className="h-9 shrink-0 cursor-pointer rounded-lg border border-[var(--border)] bg-[var(--muted)]/40 px-3 text-[12.5px] font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--muted)]"
            >
              Load
            </button>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label="Toggle fullscreen"
              className="grid size-9 cursor-pointer place-items-center rounded-lg border border-[var(--border)] bg-[var(--muted)]/40 text-[var(--foreground)]/90 transition-colors hover:bg-[var(--muted)]"
            >
              {isFullscreen ? (
                <Shrink aria-hidden className="size-3.5" />
              ) : (
                <Expand aria-hidden className="size-3.5" />
              )}
            </button>
            <button
              type="button"
              onClick={trigger}
              disabled={!loadedUrl}
              aria-label="Try this transition on your site"
              className={cn(
                "flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-[var(--foreground)] px-3 text-xs font-medium text-[var(--background)] transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40",
                triggered && "opacity-70"
              )}
            >
              <Zap className={cn("size-3", triggered && "animate-pulse")} />
              {triggered ? "Triggering..." : "Try it live"}
            </button>
          </div>
        </div>

        {/* Status hint */}
        {loadedUrl && (
          <div
            className={cn(
              "border-b px-4 py-2.5 text-[12px] leading-5",
              loaded && snippetReady
                ? "border-[var(--border)] bg-emerald-500/5 text-emerald-600 dark:text-emerald-400"
                : "border-[var(--border)] bg-[var(--muted)]/10 text-[var(--muted-foreground)]"
            )}
          >
            <span className="mr-1 inline-flex size-1.5 translate-y-[-1px] rounded-full align-middle bg-current" />
            <span className={loaded && !snippetReady ? "text-red-500" : ""}>{status}</span>
            {loaded && !snippetReady && (
              <span className="text-red-500">
                {" "}
                &mdash; add the snippet inside your site&apos;s{" "}
                <code className="font-mono">&lt;head&gt;</code>, reload, then
                hit &ldquo;Try it live&rdquo;.
              </span>
            )}
            {loaded && snippetReady && (
              <>
                {" "}
                &mdash; hit &ldquo;Try it live&rdquo; to run the transition on
                your real page.
              </>
            )}
          </div>
        )}

        {/* Frame area */}
        <div
          ref={frameRef}
          className="tk-fs-preview relative min-h-[560px] bg-[var(--background)]"
        >
          {loadedUrl ? (
            <>
              <iframe
                ref={iframeRef}
                src={loadedUrl}
                title={`Your site loaded for the ${kind} transition`}
                onLoad={handleLoad}
                onError={handleError}
                className="absolute inset-0 block h-full w-full bg-white"
                loading="lazy"
              />
              {!loaded && (
                <div className="absolute inset-0 grid place-items-center bg-[var(--background)]">
                  <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                    <Loader2 className="size-4 animate-spin" />
                    Loading {loadedUrl}
                  </div>
                </div>
              )}
              {error && (
                <div className="absolute inset-0 grid place-items-center bg-[var(--background)] px-6 text-center">
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {error}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="mx-auto flex max-w-xl flex-col items-center gap-5 px-6 py-10 text-center">
              <div>
                <Globe className="mx-auto size-10 text-[var(--muted-foreground)]" />
                <p className="mt-3 text-base text-white">
                  Preview Your Website
                </p>
              </div>

              <div className="w-full text-left">
                <p className="mb-2 text-sm text-center text-[var(--muted-foreground)]">
                  First, add this snippet to your site, based on your framework:
                </p>
                <p className="mb-2 text-sm text-center text-[var(--muted-foreground)]">
                  Paste your website's URL (e.g., http://localhost:3000) above
                  to preview it with the transition applied in real-time
                </p>
                <CodeBlock
                  value={snippetTab}
                  onValueChange={setSnippetTab}
                  data={SNIPPET_TABS}
                  className="rounded-xl border-[var(--border)] bg-[var(--background)]"
                >
                  <CodeBlockHeader className="justify-between gap-2 bg-[var(--muted)]/40 px-1.5 py-1.5">
                    <div className="flex flex-wrap items-center gap-1">
                      {SNIPPET_TABS.map((item) => (
                        <button
                          key={item.language}
                          type="button"
                          onClick={() => setSnippetTab(item.language)}
                          className={cn(
                            "cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors",
                            snippetTab === item.language
                              ? "bg-[var(--background)] text-[var(--foreground)] shadow-sm"
                              : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                          )}
                        >
                          {item.filename}
                        </button>
                      ))}
                    </div>
                    <CodeBlockCopyButton />
                  </CodeBlockHeader>
                  <CodeBlockBody>
                    {(item) => (
                      <CodeBlockItem
                        key={item.language}
                        value={item.language}
                        lineNumbers={false}
                      >
                        <CodeBlockContent language={item.highlightLang}>
                          {item.code}
                        </CodeBlockContent>
                      </CodeBlockItem>
                    )}
                  </CodeBlockBody>
                </CodeBlock>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);
