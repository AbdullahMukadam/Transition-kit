import {
	Check,
	ChevronDown,
	Link as LinkIcon,
	Share2,
	Sparkles,
	SquareCode,
	Terminal,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { TransitionTemplate } from "#/data/transitions";
import { cn } from "#/lib/utils";

const SITE_URL = "https://transition-kit.space";

function XIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
			<path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
		</svg>
	);
}

function LinkedInIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
			<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.123 2.062 2.062 0 0 1 0 4.123zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
		</svg>
	);
}

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

interface MenuItem {
	id: string;
	label: string;
	icon: IconComponent;
	action: { copy: () => string } | { open: () => string };
	hidden?: () => boolean;
}

function ActionMenu({
	label,
	icon: TriggerIcon,
	ariaLabel,
	items,
}: {
	label: React.ReactNode;
	icon?: IconComponent;
	ariaLabel: string;
	items: MenuItem[];
}) {
	const [open, setOpen] = useState(false);
	const [copiedId, setCopiedId] = useState<string | null>(null);
	const rootRef = useRef<HTMLDivElement | null>(null);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		if (!open) return;
		const onPointerDown = (event: PointerEvent) => {
			if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
		};
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") setOpen(false);
		};
		document.addEventListener("pointerdown", onPointerDown);
		document.addEventListener("keydown", onKeyDown);
		return () => {
			document.removeEventListener("pointerdown", onPointerDown);
			document.removeEventListener("keydown", onKeyDown);
		};
	}, [open]);

	useEffect(() => {
		return () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
		};
	}, []);

	const copyText = async (id: string, text: string) => {
		await navigator.clipboard.writeText(text);
		setCopiedId(id);
		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(() => {
			setCopiedId(null);
			setOpen(false);
		}, 900);
	};

	const handleSelect = (item: MenuItem) => {
		if ("copy" in item.action) {
			void copyText(item.id, item.action.copy());
		} else {
			window.open(item.action.open(), "_blank", "noopener,noreferrer");
			setOpen(false);
		}
	};

	return (
		<div ref={rootRef} className="relative">
			<button
				type="button"
				aria-haspopup="menu"
				aria-expanded={open}
				aria-label={ariaLabel}
				onClick={() => setOpen((prev) => !prev)}
				className="flex h-9 w-full cursor-pointer items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--muted)]/30 px-3 text-[12.5px] font-medium whitespace-nowrap text-[var(--foreground)]/90 transition-colors hover:bg-[var(--muted)]/60"
			>
				{TriggerIcon && <TriggerIcon aria-hidden className="size-3.5" />}
				{label}
				<ChevronDown
					aria-hidden
					className={cn(
						"ml-auto size-3 text-[var(--muted-foreground)] transition-transform duration-150 ease-out",
						open && "rotate-180",
					)}
				/>
			</button>

			<AnimatePresence>
				{open && (
					<motion.div
						role="menu"
						aria-label={ariaLabel}
						initial={{ opacity: 0, y: -4, scale: 0.98 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: -4, scale: 0.98 }}
						transition={{ duration: 0.15, ease: "easeOut" }}
						className="absolute inset-x-0 top-full z-50 mt-1.5 origin-top rounded-xl border border-[var(--border)] bg-[var(--background)] p-1 shadow-lg"
					>
						{items.map((item) => {
							if (item.hidden?.()) return null;
							const copied = "copy" in item.action && copiedId === item.id;
							const Icon = copied ? Check : item.icon;
							return (
								<button
									key={item.id}
									role="menuitem"
									type="button"
									onClick={() => handleSelect(item)}
									className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] text-[var(--muted-foreground)] transition-colors duration-100 hover:bg-[var(--muted)]/60 hover:text-[var(--foreground)]"
								>
									<Icon aria-hidden className="size-4 shrink-0" />
									{copied ? "Copied" : item.label}
								</button>
							);
						})}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

export function PlaygroundActions({
	transition,
	duration,
	easing,
}: {
	transition: TransitionTemplate;
	duration: number;
	easing: string;
}) {
	const shareUrl = `${SITE_URL}/transition/${transition.slug}`;
	const shareText = `Check out the ${transition.name} transition`;

	const installCommand = `npx shadcn@latest add @transitions/${transition.slug}`;

	const buildCode = () => {
		const componentName =
			transition.type === "theme" ? "ThemeToggleButton" : "PageTransition";
		return [
			`import { ${componentName} } from "@/components/${componentName}";`,
			`import { TRANSITION_CSS } from "@/data/transitions";`,
			"",
			`// CSS for ${transition.name}:`,
			`// Duration: ${duration}ms | Easing: ${easing.split("(")[0]}`,
			"",
			`<${componentName}`,
			`  css={\`${transition.css.replace(/`/g, "\\`")}\`}`,
			"/>",
			"",
		].join("\n");
	};

	const buildPrompt = () =>
		[
			`# Transition: ${transition.name}`,
			"",
			transition.description,
			"",
			`Category: ${transition.category} | Type: ${transition.type}`,
			`Duration: ${duration}ms | Easing: ${easing}`,
			"",
			"## CSS",
			"",
			"```css",
			transition.css,
			"```",
			"",
			"## Usage",
			"",
			"```tsx",
			buildCode().trimEnd(),
			"```",
			"",
		].join("\n");

	return (
		<div className="flex flex-col gap-1.5 px-3 pb-3">
			<ActionMenu
				label="Copy for AI"
				icon={Sparkles}
				ariaLabel={`Copy ${transition.name} for AI`}
				items={[
					{
						id: "prompt",
						label: "Copy prompt",
						icon: Sparkles,
						action: { copy: buildPrompt },
					},
					{
						id: "code",
						label: "Copy configured code",
						icon: SquareCode,
						action: { copy: buildCode },
					},
					{
						id: "install",
						label: "Copy install command",
						icon: Terminal,
						action: { copy: () => installCommand },
					},
				]}
			/>
			<ActionMenu
				label="Share"
				icon={Share2}
				ariaLabel={`Share the ${transition.name} transition`}
				items={[
					{
						id: "url",
						label: "Copy link",
						icon: LinkIcon,
						action: { copy: () => shareUrl },
					},
					{
						id: "x",
						label: "Share on X",
						icon: XIcon,
						action: {
							open: () =>
								`https://x.com/intent/post?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
						},
					},
					{
						id: "linkedin",
						label: "Share on LinkedIn",
						icon: LinkedInIcon,
						action: {
							open: () =>
								`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
						},
					},
				]}
			/>
		</div>
	);
}
