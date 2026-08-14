import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface PreviewVideoProps {
	src: string;
	className?: string;
}

const POSTER = "/demos/poster.jpg";

export default function PreviewVideo({ src, className }: PreviewVideoProps) {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [active, setActive] = useState(false);

	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;
		video.muted = true;

		const card =
			video.closest("a, [data-preview-card]") ?? video.parentElement ?? video;

		let loaded = false;
		let hovered = false;
		const play = () => {
			if (!src) return;
			hovered = true;
			if (!loaded) {
				loaded = true;
				video.src = src;
				video.load();
			}
			void video.play().catch(() => {});
		};
		const pause = () => {
			hovered = false;
			setActive(false);
			video.pause();
		};
		const onPlaying = () => {
			if (hovered) setActive(true);
		};

		video.addEventListener("playing", onPlaying);
		card.addEventListener("pointerenter", play);
		card.addEventListener("pointerleave", pause);
		card.addEventListener("focusin", play);
		card.addEventListener("focusout", pause);

		return () => {
			video.removeEventListener("playing", onPlaying);
			card.removeEventListener("pointerenter", play);
			card.removeEventListener("pointerleave", pause);
			card.removeEventListener("focusin", play);
			card.removeEventListener("focusout", pause);
		};
	}, [src]);

	return (
		<div className={cn("absolute inset-0", className)}>
			{/* Poster frame, shown until the video actually starts */}
			<img
				src={POSTER}
				alt=""
				loading="lazy"
				decoding="async"
				aria-hidden="true"
				className={cn(
					"absolute inset-0 size-full object-cover grayscale transition-[filter,opacity] duration-300 ease-out group-hover:grayscale-0 group-focus-visible:grayscale-0 motion-reduce:transition-none",
					active && "opacity-0",
				)}
			/>
			<video
				ref={videoRef}
				loop
				muted
				playsInline
				preload="none"
				disablePictureInPicture
				aria-hidden="true"
				tabIndex={-1}
				className={cn(
					"absolute inset-0 size-full object-cover transition-opacity duration-300 motion-reduce:transition-none",
					active ? "opacity-100" : "opacity-0",
				)}
			/>
		</div>
	);
}
