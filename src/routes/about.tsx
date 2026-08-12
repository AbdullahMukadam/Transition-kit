import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
	component: About,
	head: () => ({
		meta: [
			{ title: "About | Transition Kit" },
			{
				name: "description",
				content:
					"Transition Kit provides pre-built, copy-paste page transition and theme toggle components built on the View Transitions API.",
			},
			{
				name: "keywords",
				content:
					"about transition kit, view transitions api library, css transition components, theme toggle library, open source transitions",
			},
			{ property: "og:title", content: "About | Transition Kit" },
			{
				property: "og:description",
				content:
					"Transition Kit provides pre-built, copy-paste page transition and theme toggle components built on the View Transitions API.",
			},
			{
				property: "og:url",
				content: "https://transition-kit.space/about",
			},
			{
				property: "og:image",
				content: "https://transition-kit.space/og-image.webp",
			},
			{ name: "twitter:title", content: "About | Transition Kit" },
			{
				name: "twitter:description",
				content:
					"Transition Kit provides pre-built, copy-paste page transition and theme toggle components built on the View Transitions API.",
			},
			{
				name: "twitter:image",
				content: "https://transition-kit.space/og-image.webp",
			},
		],
		links: [{ rel: "canonical", href: "https://transition-kit.space/about" }],
	}),
});

function About() {
	return (
		<main className="page-wrap px-4 py-12">
			<section className="island-shell rounded-2xl p-6 sm:p-8">
				<p className="island-kicker mb-2">About</p>
				<h1 className="display-title mb-3 text-4xl font-bold text-[var(--sea-ink)] sm:text-5xl">
					A small starter with room to grow.
				</h1>
				<p className="m-0 max-w-3xl text-base leading-8 text-[var(--sea-ink-soft)]">
					TanStack Start gives you type-safe routing, server functions, and
					modern SSR defaults. Use this as a clean foundation, then layer in
					your own routes, styling, and add-ons.
				</p>
			</section>
		</main>
	);
}
