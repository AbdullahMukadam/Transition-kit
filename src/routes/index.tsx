import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { useCallback, useRef } from "react";
import NewUpdates from "#/components/home/NewUpdates";
import GapDivider from "#/components/layout/GapDivider";
import TransitionCard from "#/components/transitions/TransitionCard";
import { Button } from "#/components/ui/button";
import ButtonCreativeRight from "#/components/ui/creative-button-right";
import { TimelineAnimation } from "#/components/ui/timeline-animation";
import { transitions } from "#/data/transitions";
import { triggerLiveTransition } from "#/lib/trigger-transition";

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
				property: "og:title",
				content: "Transition Kit | Browse Templates",
			},
			{
				property: "og:description",
				content:
					"Browse 30+ page transition and theme toggle templates for the View Transitions API.",
			},
			{
				name: "twitter:title",
				content: "Transition Kit | Browse Templates",
			},
			{
				name: "twitter:description",
				content:
					"Browse 30+ page transition and theme toggle templates for the View Transitions API.",
			},
		],
	}),
});

const maskTransitions = transitions.filter((t) => t.category === "mask");
const featured = transitions.filter((t) => t.featured);
const newTransitions = transitions.filter((t) => t.isNew).slice(0, 6);

function App() {
	const timelineRef = useRef<HTMLDivElement>(null);
	const navigate = useNavigate();
	const maskIndexRef = useRef(0);

	const handleDemo = useCallback(() => {
		const t = maskTransitions[maskIndexRef.current % maskTransitions.length];
		maskIndexRef.current += 1;
		triggerLiveTransition(t.css, t.config.duration, t.config.easing);
	}, []);

	return (
		<main className="min-h-screen" ref={timelineRef}>
			{/* Announcement Bar */}
			{/* <AnnouncementBar /> */}

			{/* Hero Section */}
			<div className="text-center px-5 py-20 lg:py-32 lg:px-20 relative">
				<TimelineAnimation
					animationNum={2}
					timelineRef={timelineRef}
					className="mb-4 relative"
				>
					<NewUpdates />
				</TimelineAnimation>

				<TimelineAnimation
					as="h1"
					animationNum={3}
					timelineRef={timelineRef}
					className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.1] tracking-tight text-[var(--foreground)] mb-6 max-w-3xl mx-auto relative"
				>
					Beautiful transitions for the{" "}
					<span className="font-semibold text-[var(--foreground)]">
						modern web
					</span>
					.
				</TimelineAnimation>

				<TimelineAnimation
					as="p"
					animationNum={4}
					timelineRef={timelineRef}
					className="text-base text-[var(--muted-foreground)] leading-relaxed mb-10 max-w-xl mx-auto relative"
				>
					Premade page and theme transition templates using the View
					Transitions API. Preview them live, customize parameters, and copy
					the code directly into your project.
				</TimelineAnimation>

				<TimelineAnimation
					animationNum={5}
					timelineRef={timelineRef}
					className="flex flex-col sm:flex-row items-center justify-center gap-3 relative"
				>
					<Button
						size="lg"
						onClick={handleDemo}
						className="gap-2 bg-[var(--foreground)] text-[var(--background)] hover:bg-[var(--foreground)]/90 shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
					>
						<Sparkles className="size-4" />
						Try a theme toggle
					</Button>
					<Link to="/templates">
						<Button
							size="lg"
							variant="outline"
							className="gap-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
						>
							Browse templates
							<ArrowUpRight className="size-3.5" />
						</Button>
					</Link>
				</TimelineAnimation>

				{/* Transition names marquee */}
			</div>

			<GapDivider />

			{/* New Templates Section */}
			<div className="px-5 py-16 lg:px-20">
				<TimelineAnimation
					animationNum={2}
					timelineRef={timelineRef}
					className="flex items-center justify-between mb-8"
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
						className="text-sm font-medium text-[var(--accent)] no-underline transition hover:underline inline-flex items-center gap-1"
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
			</div>

			<GapDivider />

			{/* Featured Templates Section */}
			<div className="px-5 py-16 lg:px-20">
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

				<div className="w-full mt-8 flex items-center justify-center">
					<div className="w-52" onClick={() => navigate({ to: "/templates" })}>
						<ButtonCreativeRight
							firstText="Browse All"
							secondText="Browse All"
						/>
					</div>
				</div>
			</div>

			<GapDivider />

			{/* Browser Support */}
			<div className="px-5 py-16 lg:px-20">
				<TimelineAnimation
					animationNum={2}
					timelineRef={timelineRef}
					className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6"
				>
					<p className="island-kicker mb-2">Browser Support</p>
					<p className="m-0 max-w-3xl text-sm text-[var(--muted-foreground)]">
						The View Transitions API is currently supported in Chrome 111+ and
						Edge 111+. All templates include a graceful fallback for unsupported
						browsers. Firefox and Safari support is expected in future releases.
					</p>
				</TimelineAnimation>
			</div>
		</main>
	);
}
