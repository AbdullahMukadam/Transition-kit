import {
	createFileRoute,
	Link,
	notFound,
	useNavigate,
} from "@tanstack/react-router";
import { ArrowLeft, ChevronDown, Settings2, Zap } from "lucide-react";
import { useCallback, useState } from "react";
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
import Playground from "#/components/transitions/Playground";
import { PlaygroundSidebar } from "#/components/transitions/PlaygroundSidebar";
import { Badge } from "#/components/ui/badge";
import { getTransitionBySlug, transitions } from "#/data/transitions";
import { triggerLiveTransition } from "#/lib/trigger-transition";

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
					property: "og:title",
					content: `${loaderData.transition.name} — Transition Kit`,
				},
				{
					property: "og:description",
					content: loaderData.transition.description,
				},
				{
					name: "twitter:title",
					content: `${loaderData.transition.name} — Transition Kit`,
				},
				{
					name: "twitter:description",
					content: loaderData.transition.description,
				},
			],
			links: [
				{
					rel: "canonical",
					href: `https://transition-kit.space/transition/${loaderData.transition.slug}`,
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
		transition.config.direction ?? "left",
	);
	const hasDirection = !!transition.config.directionOptions;
	const [flash, setFlash] = useState(false);

	const isThemeTransition = transition.type === "theme";

	const handleTryLive = useCallback(() => {
		triggerLiveTransition(
			transition.css,
			duration,
			easing,
			hasDirection ? direction : undefined,
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
						{transitions.map((t) => (
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
							<Badge
								variant="secondary"
								className="uppercase text-[10px] px-2 py-0.5"
							>
								{transition.category}
							</Badge>
							{transition.isNew && (
								<Badge className="uppercase text-[10px] px-2 py-0.5 bg-[var(--accent)] text-[var(--accent-foreground)]">
									New
								</Badge>
							)}
						</div>
						<p className="max-w-2xl text-sm text-[var(--muted-foreground)] leading-relaxed">
							{transition.description}
						</p>
						<div className="flex items-center gap-4 mt-2 text-xs text-[var(--muted-foreground)]">
							<span>
								{transition.config.duration}ms ·{" "}
								{transition.config.easing.split("(")[0]}
							</span>
						</div>
					</div>

					<p className="mb-4 text-center text-base text-[var(--muted-foreground)]">
						Click{" "}
						<span className="font-medium text-[var(--foreground)]">
							&quot;Try it live&quot;
						</span>{" "}
						to see this transition in action
					</p>

					{/* Mock site with Try it live */}
					<div className="mb-4">
						<MockSite
							transition={transition}
							transitionType={isThemeTransition ? "theme" : "page"}
							duration={duration}
							easing={easing}
							direction={hasDirection ? direction : undefined}
						/>
					</div>
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
											code: transition.css,
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
