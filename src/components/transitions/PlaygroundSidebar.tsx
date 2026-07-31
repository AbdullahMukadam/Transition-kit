import { Link } from "@tanstack/react-router";
import { ArrowLeft, ChevronsUpDown, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useLayoutEffect, useState } from "react";
import Playground from "#/components/transitions/Playground";
import { PlaygroundActions } from "#/components/transitions/PlaygroundActions";
import type { TransitionTemplate } from "#/data/transitions";
import { cn } from "#/lib/utils";
import PreviewVideo from "./PreviewVideo";

const EASE = [0.23, 1, 0.32, 1] as const;

function TransitionPreviewCard({
	transition,
	isActive,
	onClick,
}: {
	transition: TransitionTemplate;
	isActive: boolean;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			data-preview-card
			aria-current={isActive ? "true" : undefined}
			onClick={onClick}
			className={cn(
				"group cursor-pointer rounded-xl border p-2 text-left transition-colors",
				isActive
					? "border-[var(--foreground)]/40 bg-[var(--muted)]/60"
					: "border-[var(--border)] bg-[var(--muted)]/20 hover:bg-[var(--muted)]/50",
			)}
		>
			<div className="relative aspect-video overflow-hidden rounded-lg">
				{transition.video ? (
					<PreviewVideo
						src={transition.video}
						className="absolute inset-0 size-full object-cover"
					/>
				) : (
					<div
						className="size-full"
						style={{
							background: `linear-gradient(135deg, ${transition.previewColors.from}, ${transition.previewColors.to})`,
						}}
					/>
				)}
			</div>
			<div className="mt-1.5 flex items-center gap-1.5 px-1 pb-0.5">
				<span className="min-w-0 truncate text-[12px] font-medium text-[var(--foreground)]">
					{transition.name}
				</span>
				<span className="shrink-0 rounded-full bg-[var(--muted)] px-1.5 py-0.5 text-[9px] font-medium uppercase text-[var(--muted-foreground)]">
					{transition.category}
				</span>
			</div>
		</button>
	);
}

function useScrollFade() {
	const [el, setEl] = useState<HTMLElement | null>(null);
	useLayoutEffect(() => {
		if (!el) return;
		const update = () => {
			const top = el.scrollTop > 4;
			const bottom = el.scrollHeight - el.clientHeight - el.scrollTop > 4;
			el.style.setProperty("--fade-top", top ? "1" : "0");
			el.style.setProperty("--fade-bottom", bottom ? "1" : "0");
		};
		update();
		el.addEventListener("scroll", update, { passive: true });
		const observer = new ResizeObserver(update);
		observer.observe(el);
		return () => {
			el.removeEventListener("scroll", update);
			observer.disconnect();
		};
	}, [el]);
	return setEl;
}

export function PlaygroundSidebar({
	activeTransition,
	transitions: allTransitions,
	duration,
	setDuration,
	easing,
	setEasing,
	direction,
	setDirection,
	onSelect,
}: {
	activeTransition: TransitionTemplate;
	transitions: TransitionTemplate[];
	duration: number;
	setDuration: (v: number) => void;
	easing: string;
	setEasing: (v: string) => void;
	direction: string;
	setDirection: (v: string) => void;
	onSelect: (slug: string) => void;
}) {
	const [pickerOpen, setPickerOpen] = useState(false);
	const setScrollEl = useScrollFade();
	const setPickerScrollEl = useScrollFade();

	useEffect(() => {
		if (!pickerOpen) return;
		const onKey = (event: KeyboardEvent) => {
			if (event.key === "Escape") setPickerOpen(false);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [pickerOpen]);

	const pick = (slug: string) => {
		setPickerOpen(false);
		if (slug !== activeTransition.slug) onSelect(slug);
	};

	const backSplat =
		activeTransition.type === "theme" ? "theme-toggles" : "page-transitions";

	return (
		<>
			{/* Desktop sidebar */}
			<aside className="fixed top-4 bottom-4 left-4 z-40 hidden w-60 flex-col rounded-2xl border border-[var(--border)] bg-[var(--background)]/70 backdrop-blur-xl backdrop-saturate-150 lg:flex">
				{/* Branding */}
				<div className="flex items-center justify-between gap-2 px-3 pt-5 pb-4">
					<Link
						to="/"
						aria-label="Home"
						className="inline-block text-lg font-semibold tracking-tight text-[var(--foreground)] transition-opacity duration-150 hover:opacity-70"
					>
						Transitions
					</Link>
					<span className="rounded-full border border-[var(--border)] px-3 py-1 text-[12px] font-semibold tracking-tight text-[var(--muted-foreground)]">
						Playground
					</span>
				</div>

				{/* Transition picker */}
				<div className="px-3 pb-3">
					<p className="pb-1.5 text-[12px] font-medium text-[var(--muted-foreground)]/70">
						Transition
					</p>
					<button
						type="button"
						data-preview-card
						aria-expanded={pickerOpen}
						aria-haspopup="dialog"
						onClick={() => setPickerOpen((prev) => !prev)}
						className="group w-full cursor-pointer rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 p-2 text-left transition-colors hover:bg-[var(--muted)]/60"
					>
						<span className="relative block aspect-video overflow-hidden rounded-lg">
							{activeTransition.video ? (
								<PreviewVideo
									src={activeTransition.video}
									className="absolute inset-0 size-full object-cover"
								/>
							) : (
								<span
									className="block size-full"
									style={{
										background: `linear-gradient(135deg, ${activeTransition.previewColors.from}, ${activeTransition.previewColors.to})`,
									}}
								/>
							)}
						</span>
						<span className="mt-2 flex items-center justify-between gap-2 px-1 pb-0.5">
							<span className="min-w-0">
								<span className="block truncate text-[13px] font-medium text-[var(--foreground)]">
									{activeTransition.name}
								</span>
								<span className="block truncate text-[11.5px] text-[var(--muted-foreground)]">
									{activeTransition.description}
								</span>
							</span>
							<ChevronsUpDown
								aria-hidden
								className="size-3.5 shrink-0 text-[var(--muted-foreground)] transition-colors group-hover:text-[var(--foreground)]"
							/>
						</span>
					</button>
				</div>

				{/* Actions */}
				<PlaygroundActions
					transition={activeTransition}
					duration={duration}
					easing={easing}
				/>

				{/* Scrollable controls */}
				<div ref={setScrollEl} className="flex-1 overflow-y-auto px-3 pb-3">
					<p className="pb-2 text-[12px] font-medium text-[var(--muted-foreground)]/70">
						Controls
					</p>
					<Playground
						duration={duration}
						setDuration={setDuration}
						easing={easing}
						setEasing={setEasing}
						direction={direction}
						setDirection={setDirection}
						hasDirection={activeTransition.config.direction !== undefined}
						directionOptions={activeTransition.config.directionOptions}
					/>
				</div>

				{/* Back to Docs */}
				<div className="border-t border-[var(--border)]/50 p-2">
					<Link
						to="/templates/$"
						params={{ _splat: backSplat }}
						className="flex items-center justify-center gap-2 rounded-[calc(1rem-0.5rem)] bg-[var(--foreground)] px-3 py-3 text-sm font-medium text-[var(--background)] transition-opacity duration-150 hover:opacity-85"
					>
						<ArrowLeft className="size-4" />
						Back to{" "}
						{activeTransition.type === "theme"
							? "Theme Toggles"
							: "Page Transitions"}
					</Link>
				</div>
			</aside>

			{/* Picker overlay */}
			<AnimatePresence>
				{pickerOpen && (
					<>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.15 }}
							aria-hidden
							onClick={() => setPickerOpen(false)}
							className="fixed inset-0 z-40 hidden bg-black/10 lg:block"
						/>
						<motion.div
							role="dialog"
							aria-label="Pick a transition"
							initial={{ opacity: 0, x: -12, scale: 0.99 }}
							animate={{ opacity: 1, x: 0, scale: 1 }}
							exit={{ opacity: 0, x: -12, scale: 0.99 }}
							transition={{ duration: 0.3, ease: EASE }}
							className="fixed top-4 bottom-4 left-[16.5rem] z-50 hidden w-120 max-w-[calc(100vw-18rem)] flex-col rounded-2xl border border-[var(--border)] bg-[var(--background)]/85 shadow-xl shadow-black/5 backdrop-blur-xl backdrop-saturate-150 lg:flex"
						>
							<div className="flex items-center justify-between border-b border-[var(--border)]/50 py-3 pr-3 pl-5">
								<p className="text-[13px] font-semibold tracking-[-0.01em] text-[var(--foreground)]">
									Pick a transition
								</p>
								<button
									type="button"
									onClick={() => setPickerOpen(false)}
									aria-label="Close picker"
									className="grid size-7 cursor-pointer place-items-center rounded-lg text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)]/60 hover:text-[var(--foreground)]"
								>
									<X aria-hidden className="size-3.5" />
								</button>
							</div>
							<div
								ref={setPickerScrollEl}
								className="mr-1.5 grid flex-1 auto-rows-min grid-cols-2 gap-2 overflow-y-auto py-3 pr-1.5 pl-3"
							>
								{allTransitions
									.filter((t) => t.type === activeTransition.type)
									.map((t) => (
										<TransitionPreviewCard
											key={t.slug}
											transition={t}
											isActive={t.slug === activeTransition.slug}
											onClick={() => pick(t.slug)}
										/>
									))}
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</>
	);
}
