import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useCallback, useRef } from "react";
import { Hero } from "#/components/home/Hero";
import GapDivider from "#/components/layout/GapDivider";
import { MockSite } from "#/components/transitions/MockSite";
import TransitionCard from "#/components/transitions/TransitionCard";
import { Button } from "#/components/ui/button";
import ButtonCreativeRight from "#/components/ui/creative-button-right";
import { TimelineAnimation } from "#/components/ui/timeline-animation";
import { transitions } from "#/data/transitions";
import { homeOptions } from "@/lib/layout.shared";
import NewUpdates from "#/components/home/NewUpdates";

export const Route = createFileRoute("/")({
  component: App,
  head: () => ({
    meta: [
      {
        name: "description",
        content:
          "Browse 30+ page transition and theme toggle templates. Fade, slide, scale, flip, blur, mask reveals, and 3D transitions for the View Transitions API.",
      },
      {
        name: "keywords",
        content:
          "view transitions, view transitions api, page transition, theme transition, theme toggle, dark mode transition, CSS mask, fade transition, slide transition, scale transition, flip transition, 3d page transition, react router transition, next.js transition, shadcn",
      },
      {
        property: "og:title",
        content: "Transition Kit | Beautiful Transitions for the Modern Web",
      },
      {
        property: "og:description",
        content:
          "Browse 30+ page transition and theme toggle templates for the View Transitions API.",
      },
      {
        property: "og:url",
        content: "https://transition-kit.space/",
      },
      {
        property: "og:image",
        content: "https://transition-kit.space/og-image.webp",
      },
      {
        name: "twitter:title",
        content: "Transition Kit | Beautiful Transitions for the Modern Web",
      },
      {
        name: "twitter:description",
        content:
          "Browse 30+ page transition and theme toggle templates for the View Transitions API.",
      },
      {
        name: "twitter:image",
        content: "https://transition-kit.space/og-image.webp",
      },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://transition-kit.space/",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        dangerouslySetInnerHTML: {
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Transition Kit Templates",
            url: "https://transition-kit.space/",
            description:
              "Pre-built, copy-paste page transition and theme toggle components using the View Transitions API.",
            isPartOf: {
              "@type": "WebSite",
              name: "Transition Kit",
              url: "https://transition-kit.space",
            },
            numberOfItems: transitions.length,
          }),
        },
      },
    ],
  }),
});

const featured = transitions.filter((t) => t.featured);
const newTransitions = transitions.filter((t) => t.isNew).slice(0, 6);

function App() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate()

  const handleDemo = useCallback(() => {
    navigate({href:"/templates/theme-toggles"})
  }, []);

  return (
    <HomeLayout {...homeOptions()}>
      <main className="min-h-screen pt-4 pb-6 md:pb-12" ref={timelineRef}>
        {/* Hero */}
        <div className="relative mx-auto flex h-[70vh] min-h-[600px] w-full max-w-[1250px] overflow-hidden rounded-2xl border p-4 md:p-8">
          <Hero />
          {/* Preview image — clipped by container: centered on mobile, right on desktop */}
          <div className="pointer-events-none absolute left-1/2 top-[60%] z-[1] w-[85%] -translate-x-1/2 md:left-auto md:right-0 md:w-[55%] md:translate-x-0">
            <MockSite />
          </div>
          <div className="z-[2] flex size-full flex-col max-md:items-center max-md:text-center px-4 md:p-12">
            <TimelineAnimation
              animationNum={2}
              timelineRef={timelineRef}
              className=" relative"
            >
              <NewUpdates />
            </TimelineAnimation>

            <h1 className="mt-4 mb-6 text-4xl text-white leading-[1.05] font-medium xl:mt-8 xl:mb-10 xl:text-5xl">
              Build beautiful
              <br className="md:hidden" /> transitions,
              <br />
              of your <span className="text-white">style</span>.
            </h1>
            <div className="flex flex-row flex-wrap items-center justify-center gap-4 w-fit">
              <Button size="lg" onClick={handleDemo} className="gap-2">
                Get Started
                <ArrowRight className="size-3.5" />
              </Button>
              <Link to="/templates" className="no-underline">
                <Button size="lg" variant="secondary" className="gap-1.5">
                  Browse templates
                  <ArrowUpRight className="size-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Statement */}
        <div className="mx-auto mt-12 grid w-full max-w-[1400px] mb-8 grid-cols-1 gap-10 px-6 lg:mt-12 md:px-12 lg:grid-cols-2">
          <p className="text-2xl leading-snug tracking-tight font-light col-span-full md:text-3xl xl:text-4xl">
            Transition Kit is a{" "}
            <span className="font-medium">page transition</span> and{" "}
            <span className="font-medium">theme toggle</span> library for the
            modern web, powered by the{" "}
            <span className="font-medium">View Transitions API</span>. Preview
            templates live, customize the timing and easing, and copy the code
            straight into your project.
          </p>
        </div>

        <GapDivider />

        {/* New Templates */}
        <section className="mx-auto w-full px-5 py-16 lg:px-20">
          <TimelineAnimation
            animationNum={2}
            timelineRef={timelineRef}
            className="mb-8 flex items-end justify-between"
          >
            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)] tracking-tight">
                New Templates
              </h2>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                GIF mask-based theme transitions
              </p>
            </div>
            <Link
              to="/templates"
              className="text-sm font-medium text-[var(--foreground)] no-underline transition hover:text-[var(--muted-foreground)] inline-flex items-center gap-1"
            >
              View all
              <ArrowUpRight className="size-3.5" />
            </Link>
          </TimelineAnimation>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {newTransitions.map((t, i) => (
              <TimelineAnimation
                key={t.slug}
                animationNum={3 + i}
                timelineRef={timelineRef}
              >
                <TransitionCard transition={t} index={i} />
              </TimelineAnimation>
            ))}
          </div>
        </section>

        <GapDivider />

        {/* Featured Templates */}
        <section className="mx-auto w-full px-5 py-16 lg:px-20">
          <TimelineAnimation
            animationNum={2}
            timelineRef={timelineRef}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold text-[var(--foreground)] tracking-tight">
              Featured Templates
            </h2>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Mask-based theme transitions
            </p>
          </TimelineAnimation>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((t, i) => (
              <TimelineAnimation
                key={t.slug}
                animationNum={3 + i}
                timelineRef={timelineRef}
              >
                <TransitionCard transition={t} index={i} />
              </TimelineAnimation>
            ))}
          </div>

          <div className="mt-8 flex w-full items-center justify-center">
            <Link to="/templates" className="w-52 no-underline">
              <ButtonCreativeRight
                firstText="Browse All"
                secondText="Browse All"
              />
            </Link>
          </div>
        </section>

        <GapDivider />

        {/* Browser Support */}
        <section className="mx-auto w-full max-w-5xl px-5 py-16 lg:px-20">
          <TimelineAnimation
            animationNum={2}
            timelineRef={timelineRef}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8"
          >
            <p className="mb-2 text-sm font-medium uppercase tracking-widest text-[var(--muted-foreground)]">
              Browser Support
            </p>
            <p className="m-0 max-w-3xl text-[var(--muted-foreground)]">
              The View Transitions API is currently supported in Chrome 111+,
              Edge 111+, and Opera 111+. All templates include a graceful
              fallback for unsupported browsers. Firefox and Safari support is
              expected in future releases.
            </p>
          </TimelineAnimation>
        </section>
      </main>
    </HomeLayout>
  );
}
