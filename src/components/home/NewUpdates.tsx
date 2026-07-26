import { Link } from "@tanstack/react-router";
import React, { useEffect, useState } from "react";

const newTransitions = [
	{ slug: "gif-frog", name: "GIF Frog" },
	{ slug: "gif-penguin", name: "GIF Penguin" },
	{ slug: "gif-cat", name: "GIF Cat" },
	{ slug: "circle-blur", name: "Circle Blur" },
	{ slug: "circle-reveal", name: "Circle Reveal" },
	{ slug: "polygon-reveal", name: "Polygon Reveal" },
];

export default function NewUpdates() {
	const [activeIndex, setActiveIndex] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setActiveIndex((prev) => (prev + 1) % newTransitions.length);
		}, 3000);
		return () => clearInterval(interval);
	}, []);

	return (
		<>
			{newTransitions.map((item, index) => (
				<React.Fragment key={item.slug}>
					{activeIndex === index && (
						<Link
							to="/transition/$slug"
							params={{ slug: item.slug }}
							className="inline-flex w-fit mx-auto items-center gap-1 rounded-full bg-[var(--foreground)] border-4 border-[var(--foreground)]/20 shadow-[var(--foreground)]/40 py-0.5 pl-0.5 pr-3 text-xs"
						>
							<div className="rounded-full bg-[var(--background)] px-2 py-1 text-xs text-[var(--foreground)]">
								New
							</div>
							<p className="text-[var(--background)] sm:text-base text-xs inline-block">
								Introducing{" "}
								<span className="px-1 font-semibold">{item.name}</span>
							</p>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								aria-hidden="true"
								className="h-3 w-3 text-[var(--background)]"
							>
								<path
									fillRule="evenodd"
									d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
									clipRule="evenodd"
								/>
							</svg>
						</Link>
					)}
				</React.Fragment>
			))}
		</>
	);
}
