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
		const play = () => {
			void video.play().catch(() => {});
		};
		const pause = () => {
			video.pause();
		};

		card.addEventListener("pointerenter", play);
		card.addEventListener("pointerleave", pause);
		card.addEventListener("focusin", play);
		card.addEventListener("focusout", pause);
		return () => {
			card.removeEventListener("pointerenter", play);
			card.removeEventListener("pointerleave", pause);
			card.removeEventListener("focusin", play);
			card.removeEventListener("focusout", pause);
		};
	}, []);

	return (
		<video
			ref={ref}
			src={src}
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
