import {
  createFileRoute,
  Link,
  notFound,
  useNavigate,
} from "@tanstack/react-router";
import {
  ArrowLeft,
  ChevronDown,
  Expand,
  Globe,
  Monitor,
  Settings2,
  Shrink,
  Zap,
} from "lucide-react";
import {
  lazy,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CodeBlock,
  CodeBlockBody,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockItem,
  CodeBlockSelect,
  CodeBlockSelectContent,
  CodeBlockSelectItem,
  CodeBlockSelectTrigger,
  CodeBlockSelectValue,
} from "#/components/kibo-ui/code-block";
import { MockSite } from "#/components/transitions/MockSite";
import { EmbedPreview } from "#/components/transitions/EmbedPreview";
import Playground from "#/components/transitions/Playground";
import { TransitionPageActions } from "#/components/transitions/TransitionPageActions";
import { getTransitionBySlug, transitions } from "#/data/transitions";
import {
  buildTransitionCSS,
  triggerLiveTransition,
} from "#/lib/trigger-transition";

const PlaygroundSidebar = lazy(
  () => import("#/components/transitions/PlaygroundSidebar")
);

export const Route = createFileRoute("/transition/$slug")({
  component: TransitionDetail,
  loader: ({ params }) => {
    const transition = getTransitionBySlug(params.slug);
    if (!transition) throw notFound();
    return { transition };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    return {
      meta: [
        {
          title: `${loaderData.transition.name} — Transition Kit`,
        },
        {
          name: "description",
          content: loaderData.transition.description,
        },
        {
          name: "keywords",
          content: `${loaderData.transition.name.toLowerCase()}, ${loaderData.transition.category} transition, view transitions api, css transition, theme transition, page transition, copy paste transition component`,
        },
        {
          property: "og:title",
          content: `${loaderData.transition.name} — Transition Kit`,
        },
        {
          property: "og:description",
          content: loaderData.transition.description,
        },
        {
          property: "og:type",
          content: "article",
        },
        {
          property: "og:image",
          content: "https://transition-kit.space/og-image.webp",
        },
        {
          name: "twitter:title",
          content: `${loaderData.transition.name} — Transition Kit`,
        },
        {
          name: "twitter:description",
          content: loaderData.transition.description,
        },
        {
          name: "twitter:image",
          content: "https://transition-kit.space/og-image.webp",
        },
      ],
      links: [
        {
          rel: "canonical",
          href: `https://transition-kit.space/transition/${loaderData.transition.slug}`,
        },
      ],
      scripts: [
        {
          type: "application/ld+json",
          dangerouslySetInnerHTML: {
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TechArticle",
              headline: `${loaderData.transition.name} transition for the View Transitions API`,
              description: loaderData.transition.description,
              url: `https://transition-kit.space/transition/${loaderData.transition.slug}`,
              author: {
                "@type": "Organization",
                name: "Transition Kit",
              },
              publisher: {
                "@type": "Organization",
                name: "Transition Kit",
                logo: {
                  "@type": "ImageObject",
                  url: "https://transition-kit.space/logo512.png",
                },
              },
              about: [
                "View Transitions API",
                "CSS transitions",
                `${loaderData.transition.category} transitions`,
              ],
            }),
          },
        },
      ],
    };
  },
});

function TransitionDetail() {
  const { transition } = Route.useLoaderData();
  const [duration, setDuration] = useState(transition.config.duration);
  const [easing, setEasing] = useState(transition.config.easing);
  const [direction, setDirection] = useState<string>(
    transition.config.direction ?? "left"
  );
  const hasDirection = !!transition.config.directionOptions;
  const [flash, setFlash] = useState(false);

  const isThemeTransition = transition.type === "theme";
  const embedRef = useRef<{ trigger: () => void } | null>(null);

  const handleTryLive = useCallback(() => {
    triggerLiveTransition(
      transition.css,
      duration,
      easing,
      hasDirection ? direction : undefined
    );
    setFlash(true);
    setTimeout(() => setFlash(false), duration + 200);
  }, [
    transition.css,
    duration,
    easing,
    direction,
    hasDirection,
    transition.slug,
  ]);

  const nav = useNavigate();
  const handleSelectTransition = (slug: string) => {
    nav({ to: "/transition/$slug", params: { slug } });
  };

  const previewCSS = useMemo(
    () =>
      buildTransitionCSS(
        transition.css,
        duration,
        easing,
        hasDirection ? direction : undefined
      ),
    [transition.css, duration, easing, hasDirection, direction]
  );

  return (
    <div className="min-h-screen">
      {/* Flash overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-50 bg-[var(--foreground)] transition-opacity duration-300"
        style={{
          opacity: flash ? 0.08 : 0,
        }}
      />

      {/* Mobile top bar */}
      <div className="fixed top-3 right-3 left-3 z-40 flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--background)]/70 p-2 backdrop-blur-xl backdrop-saturate-150 lg:hidden">
        <Link
          to="/templates/$"
          params={{
            _splat: isThemeTransition ? "theme-toggles" : "page-transitions",
          }}
          aria-label="Back"
          className="grid size-9 shrink-0 place-items-center rounded-lg text-[var(--muted-foreground)] transition-colors duration-150 hover:bg-[var(--muted)]/60 hover:text-[var(--foreground)]"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">Pick a transition</span>
          <select
            value={transition.slug}
            onChange={(event) => handleSelectTransition(event.target.value)}
            className="h-9 w-full cursor-pointer appearance-none truncate rounded-lg border border-[var(--border)] bg-[var(--background)] pr-8 pl-2.5 text-sm font-medium text-[var(--foreground)]"
          >
            {transitions
              .filter((t) => t.type === transition.type)
              .map((t) => (
                <option key={t.slug} value={t.slug}>
                  {t.name}
                </option>
              ))}
          </select>
          <ChevronDown
            aria-hidden
            className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-[var(--muted-foreground)]"
          />
        </label>
        <button
          type="button"
          onClick={handleTryLive}
          className="grid size-9 shrink-0 place-items-center rounded-lg bg-[var(--foreground)] text-[var(--background)] transition-opacity duration-150 hover:opacity-85"
          aria-label="Try this transition live"
        >
          <Zap className="size-4" />
        </button>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <PlaygroundSidebar
          activeTransition={transition}
          transitions={transitions}
          duration={duration}
          setDuration={setDuration}
          easing={easing}
          setEasing={setEasing}
          direction={direction}
          setDirection={setDirection}
          onSelect={handleSelectTransition}
        />
      </div>

      {/* Main content */}
      <main className="pt-16 lg:ml-64 lg:pt-0 overflow-x-hidden">
        <div className="mx-auto w-full max-w-5xl px-5 py-8 lg:px-12 min-w-0">
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-2xl font-semibold text-[var(--foreground)] tracking-tight sm:text-3xl">
                {transition.name}
              </h1>
              {transition.isNew && (
                <span className="flex items-center gap-1 text-[11px] font-medium text-[var(--accent)]">
                  <span className="size-1.5 rounded-full bg-[var(--accent)]" />
                  New
                </span>
              )}
            </div>
            <p className="max-w-2xl text-sm text-[var(--muted-foreground)] leading-relaxed">
              {transition.description}
            </p>
            <div className="mt-4">
              <TransitionPageActions transition={transition} />
            </div>
          </div>

          <p className="mb-4 text-center text-base text-[var(--muted-foreground)]">
            Click{" "}
            <span className="font-medium text-[var(--foreground)]">
              &quot;Try it live&quot;
            </span>{" "}
            to see this transition in action
          </p>

          {/* Preview tabs */}
          <Tabs defaultValue="mock" className="mb-6 flex w-full flex-col">
            <TabsList className="w-full sm:w-fit">
              <TabsTrigger value="mock" className="h-6">
                <Monitor />
                Mock Site
              </TabsTrigger>
              <TabsTrigger value="site" className="h-6">
                <Globe />
                Your Site
              </TabsTrigger>
            </TabsList>

            <TabsContent value="mock" className="m-0 w-full">
              <FullscreenPreview>
                <MockSite
                  transition={transition}
                  transitionType={isThemeTransition ? "theme" : "page"}
                  duration={duration}
                  easing={easing}
                  direction={hasDirection ? direction : undefined}
                />
              </FullscreenPreview>
            </TabsContent>
            <TabsContent value="site" className="m-0 w-full">
              <EmbedPreview
                ref={embedRef}
                css={previewCSS}
                kind={isThemeTransition ? "theme" : "page"}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Mobile playground controls */}
        <div className="mx-auto max-w-4xl px-5 pb-6 lg:px-12 lg:hidden">
          <MobileControls
            duration={duration}
            setDuration={setDuration}
            easing={easing}
            setEasing={setEasing}
            direction={direction}
            setDirection={setDirection}
            hasDirection={hasDirection}
            directionOptions={transition.config.directionOptions}
          />
        </div>

        {/* Step-by-step integration guide */}
        <div className="mx-auto w-full max-w-4xl px-5 pb-12 lg:px-12 min-w-0">
          <h2 className="text-xl font-semibold text-[var(--foreground)] tracking-tight mb-8">
            Get Started
          </h2>

          <div className="space-y-10">
            {/* Step 1: Add the CSS */}
            <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
              <div className="lg:sticky lg:top-8 lg:self-start">
                <div className="flex items-center gap-3 mb-2">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold">
                    1
                  </span>
                  <h3 className="text-sm font-semibold text-[var(--foreground)]">
                    Add the CSS
                  </h3>
                </div>
                <p className="text-sm text-[var(--muted-foreground)] ml-10">
                  Copy the CSS below and add it to your global stylesheet. It
                  updates live with playground changes.
                </p>
              </div>
              <div className="min-w-0">
                <CodeBlock
                  defaultValue="css"
                  data={[
                    {
                      language: "css",
                      filename: "transitions.css",
                      code: previewCSS,
                    },
                  ]}
                >
                  <CodeBlockHeader>
                    <CodeBlockCopyButton />
                  </CodeBlockHeader>
                  <CodeBlockBody>
                    {(item) => (
                      <CodeBlockItem value={item.language}>
                        <CodeBlockContent language="css">
                          {item.code}
                        </CodeBlockContent>
                      </CodeBlockItem>
                    )}
                  </CodeBlockBody>
                </CodeBlock>
              </div>
            </div>

            {/* Step 2: Set up the transition */}
            <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
              <div className="lg:sticky lg:top-8 lg:self-start">
                <div className="flex items-center gap-3 mb-2">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold">
                    2
                  </span>
                  <h3 className="text-sm font-semibold text-[var(--foreground)]">
                    {isThemeTransition
                      ? "Set up theme toggle"
                      : "Wrap route changes"}
                  </h3>
                </div>
                <p className="text-sm text-[var(--muted-foreground)] ml-10">
                  {isThemeTransition
                    ? "Wrap your theme toggle function in document.startViewTransition() to activate the transition effect."
                    : "Use your framework's router to wrap navigation in document.startViewTransition()."}
                </p>
              </div>
              <div className="min-w-0">
                <CodeBlock
                  defaultValue="js"
                  data={[
                    {
                      language: "js",
                      filename: "app.js",
                      code: transition.js,
                    },
                    {
                      language: "react",
                      filename: "App.tsx",
                      code: transition.frameworks.react,
                    },
                    {
                      language: "nextjs",
                      filename: "page.tsx",
                      code: transition.frameworks.nextjs,
                    },
                    {
                      language: "vue",
                      filename: "App.vue",
                      code: transition.frameworks.vue,
                    },
                    {
                      language: "svelte",
                      filename: "App.svelte",
                      code: transition.frameworks.svelte,
                    },
                  ]}
                >
                  <CodeBlockHeader>
                    <CodeBlockSelect>
                      <CodeBlockSelectTrigger />
                      <CodeBlockSelectValue placeholder="Select a file" />
                      <CodeBlockSelectContent>
                        {(item) => (
                          <CodeBlockSelectItem
                            key={item.language}
                            value={item.language}
                          >
                            {item.filename}
                          </CodeBlockSelectItem>
                        )}
                      </CodeBlockSelectContent>
                    </CodeBlockSelect>
                    <CodeBlockCopyButton />
                  </CodeBlockHeader>
                  <CodeBlockBody>
                    {(item) => (
                      <CodeBlockItem key={item.language} value={item.language}>
                        <CodeBlockContent
                          language={
                            item.language === "js"
                              ? "javascript"
                              : item.language === "react" ||
                                  item.language === "nextjs"
                                ? "tsx"
                                : "html"
                          }
                        >
                          {item.code}
                        </CodeBlockContent>
                      </CodeBlockItem>
                    )}
                  </CodeBlockBody>
                </CodeBlock>
              </div>
            </div>

            {/* Step 3: Customize */}
            <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
              <div className="lg:sticky lg:top-8 lg:self-start">
                <div className="flex items-center gap-3 mb-2">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold">
                    3
                  </span>
                  <h3 className="text-sm font-semibold text-[var(--foreground)]">
                    Customize
                  </h3>
                </div>
                <p className="text-sm text-[var(--muted-foreground)] ml-10">
                  Adjust duration and easing in the sidebar controls to match
                  your design. The CSS updates automatically.
                </p>
              </div>
              <div className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--card)]/50 p-6 flex items-center justify-center">
                <p className="text-sm text-[var(--muted-foreground)]">
                  Use the playground controls in the sidebar to tweak timing and
                  easing.
                </p>
              </div>
            </div>

            {/* Step 4: Test */}
            <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
              <div className="lg:sticky lg:top-8 lg:self-start">
                <div className="flex items-center gap-3 mb-2">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold">
                    4
                  </span>
                  <h3 className="text-sm font-semibold text-[var(--foreground)]">
                    Test
                  </h3>
                </div>
                <p className="text-sm text-[var(--muted-foreground)] ml-10">
                  {isThemeTransition
                    ? "Toggle your theme to see the transition in action."
                    : "Navigate between pages to see the transition in action."}
                </p>
              </div>
              <div className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--card)]/50 p-6 flex items-center justify-center">
                <p className="text-sm text-[var(--muted-foreground)]">
                  Click the "Try it live" button to preview, then test in your
                  own project.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function MobileControls({
  duration,
  setDuration,
  easing,
  setEasing,
  direction,
  setDirection,
  hasDirection,
  directionOptions,
}: {
  duration: number;
  setDuration: (v: number) => void;
  easing: string;
  setEasing: (v: string) => void;
  direction: string;
  setDirection: (v: string) => void;
  hasDirection: boolean;
  directionOptions?: { label: string; value: string }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)]/20">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full cursor-pointer items-center justify-between gap-2 px-4 py-3 text-sm font-medium text-[var(--foreground)]"
      >
        <span className="flex items-center gap-2">
          <Settings2 className="size-4" />
          Playground Controls
        </span>
        <ChevronDown
          className={`size-4 text-[var(--muted-foreground)] transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="border-t border-[var(--border)] px-4 py-4">
          <Playground
            duration={duration}
            setDuration={setDuration}
            easing={easing}
            setEasing={setEasing}
            direction={direction}
            setDirection={setDirection}
            hasDirection={hasDirection}
            directionOptions={directionOptions}
          />
        </div>
      )}
    </div>
  );
}

function FullscreenPreview({
  children,
  label = "Preview",
}: {
  children: ReactNode;
  label?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onFullscreenChange = () =>
      setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const toggle = () => {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else if (ref.current) {
      void ref.current.requestFullscreen();
    }
  };

  return (
    <div
      ref={ref}
      className="tk-fs-preview overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)]"
    >
      <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--muted)]/30 px-3 py-2">
        <span className="text-xs font-medium text-[var(--muted-foreground)]">
          {label}
        </span>
        <button
          type="button"
          onClick={toggle}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-[var(--muted-foreground)] transition-colors duration-150 hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
        >
          {isFullscreen ? (
            <>
              <Shrink aria-hidden className="size-3.5" />
              Exit
            </>
          ) : (
            <>
              <Expand aria-hidden className="size-3.5" />
              Fullscreen
            </>
          )}
        </button>
      </div>
      <div className="tk-fs-fill py-2">{children}</div>
    </div>
  );
}
