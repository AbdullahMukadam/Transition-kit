import { Link } from "@tanstack/react-router";
import { Zap } from "lucide-react";
import { useCallback, useState } from "react";
import type { TransitionTemplate } from "@/data/transitions";
import { triggerLiveTransition } from "@/lib/trigger-transition";
import PreviewVideo from "./PreviewVideo";

interface TransitionCardProps {
	transition: TransitionTemplate;
	index: number;
	className?: string;
}

export default function TransitionCard({
	transition,
	index,
	className,
}: TransitionCardProps) {
	const [flash, setFlash] = useState(false);

	const handleTry = useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();
			triggerLiveTransition(
				transition.css,
				transition.config.duration,
				transition.config.easing,
			);
			setFlash(true);
			setTimeout(() => setFlash(false), transition.config.duration + 200);
		},
		[transition],
	);

	return (
		<Link
			to="/transition/$slug"
			params={{ slug: transition.slug }}
			className={`group no-underline flex h-full flex-col rounded-2xl border border-border/60 bg-muted/30 p-2 transition-colors duration-150 hover:bg-muted/50 ${className}`}
		>
			<div
				className={`relative flex aspect-16/9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-border/70 bg-zinc-800 dark:bg-zinc-900`}
				style={{ animationDelay: `${index * 80 + 60}ms` }}
			>
				{transition.video ? (
					<PreviewVideo
						src={transition.video}
						className="absolute inset-0 size-full object-cover"
					/>
				) : null}
				{transition.video ? (
					<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10" />
				) : null}
				{flash ? <div className="absolute inset-0 bg-white/10" /> : null}
				<div className="flex flex-col items-center gap-3 text-center">
					<div className="flex flex-col items-center gap-1.5">
						<p className="text-lg font-medium text-white/90">
							{transition.name}
						</p>
						<p className="text-xs text-white/50">
							{transition.config.duration}ms ·{" "}
							{transition.config.easing.split("(")[0]}
						</p>
					</div>
					<button
						type="button"
						onClick={handleTry}
						className="flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1 text-xs font-light text-white/80 transition-colors hover:bg-white/10 cursor-pointer"
					>
						<Zap className="size-3" />
						Try it
					</button>
				</div>
			</div>
			<div className="px-2.5 pt-3.5 pb-2.5">
				<h2 className="text-[15px] font-medium tracking-tight">
					{transition.name}
				</h2>
				<p className="mt-1 text-sm leading-6 text-muted-foreground">
					{transition.description}
				</p>
				<div className="mt-2 flex items-center gap-2">
					<p className="text-xs rounded-full border border-border/60 px-2 py-0.5 text-muted-foreground">
						{transition.category}
					</p>
					{transition.isNew && (
						<p className="text-xs rounded-full border border-accent px-2 py-0.5 text-accent">
							New
						</p>
					)}
				</div>
			</div>
		</Link>
	);
}
