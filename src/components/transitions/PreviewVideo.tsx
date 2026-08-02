import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface PreviewVideoProps {
	src: string;
	className?: string;
}

export default function PreviewVideo({ src, className }: PreviewVideoProps) {
	const ref = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		const video = ref.current;
		if (!video) return;
		video.muted = true;

		const card =
			video.closest("a, [data-preview-card]") ?? video.parentElement ?? video;

		let loaded = false;
		const load = () => {
			if (loaded || !src) return;
			loaded = true;
			video.src = src;
			video.load();
		};

		const play = () => {
			load();
			void video.play().catch(() => {});
		};
		const pause = () => {
			video.pause();
		};

		card.addEventListener("pointerenter", play);
		card.addEventListener("pointerleave", pause);
		card.addEventListener("focusin", play);
		card.addEventListener("focusout", pause);

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) load();
				}
			},
			{ rootMargin: "300px" },
		);
		observer.observe(video);

		return () => {
			observer.disconnect();
			card.removeEventListener("pointerenter", play);
			card.removeEventListener("pointerleave", pause);
			card.removeEventListener("focusin", play);
			card.removeEventListener("focusout", pause);
		};
	}, [src]);

	return (
		<video
			ref={ref}
			loop
			muted
			playsInline
			preload="metadata"
			disablePictureInPicture
			aria-hidden="true"
			tabIndex={-1}
			className={cn(
				"grayscale transition-[filter] duration-300 ease-out group-hover:grayscale-0 group-focus-visible:grayscale-0 motion-reduce:transition-none",
				className,
			)}
		/>
	);
}
