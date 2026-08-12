import { TanStackDevtools } from "@tanstack/react-devtools";
import {
	createRootRoute,
	HeadContent,
	Scripts,
	useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { RootProvider } from "fumadocs-ui/provider/tanstack";
import Container from "#/components/layout/Container";
import { getThemeServerFn } from "#/lib/theme";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import appCss from "../styles.css?url";

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark')?stored:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(mode);root.style.colorScheme=mode;}catch(e){}})();`;

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Transition Kit | Page/Theme Transition Templates",
			},
			{
				name: "description",
				content:
					"Pre-built, copy-paste page and theme transition and theme toggle components using the View Transitions API. Fade, slide, scale, flip, blur, mask reveals, and more.",
			},
			{
				name: "keywords",
				content:
					"view transitions, view transitions api, page transitions, theme transitions, theme toggle, dark mode transition, CSS transitions, CSS animations, CSS mask, Web Animations API, React transition component, next.js page transition, Vue route transition, Svelte page transition, shadcn ui, animated theme switcher, transition kit, copy paste components",
			},
			{
				name: "robots",
				content: "index, follow, max-image-preview:large, max-snippet:-1",
			},
			{
				name: "author",
				content: "Transition Kit",
			},
			{
				name: "theme-color",
				content: "#ffffff",
				media: "(prefers-color-scheme: light)",
			},
			{
				name: "theme-color",
				content: "#0a0a0a",
				media: "(prefers-color-scheme: dark)",
			},
			{
				property: "og:type",
				content: "website",
			},
			{
				property: "og:site_name",
				content: "Transition Kit",
			},
			{
				property: "og:locale",
				content: "en_US",
			},
			{
				property: "og:title",
				content: "Transition Kit | Page/Theme Transition Templates",
			},
			{
				property: "og:description",
				content:
					"Pre-built, copy-paste page transition and theme toggle components using the View Transitions API.",
			},
			{
				property: "og:url",
				content: "https://transition-kit.space",
			},
			{
				property: "og:image",
				content: "https://transition-kit.space/og-image.webp",
			},
			{
				property: "og:image:width",
				content: "1200",
			},
			{
				property: "og:image:height",
				content: "630",
			},
			{
				property: "og:image:alt",
				content:
					"Transition Kit — copy-paste page transition and theme toggle templates for the View Transitions API.",
			},
			{
				name: "twitter:card",
				content: "summary_large_image",
			},
			{
				name: "twitter:title",
				content: "Transition Kit | Page/Theme Transition Templates",
			},
			{
				name: "twitter:description",
				content:
					"Pre-built, copy-paste page and theme transition and theme toggle components using the View Transitions API.",
			},
			{
				name: "twitter:image",
				content: "https://transition-kit.space/og-image.webp",
			},
			{
				name: "twitter:image:alt",
				content:
					"Transition Kit — copy-paste page transition and theme toggle templates for the View Transitions API.",
			},
			{
				name: "twitter:site",
				content: "@transitionkit",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
			{
				rel: "canonical",
				href: "https://transition-kit.space",
			},
			{
				rel: "icon",
				type: "image/x-icon",
				href: "/favicon.ico",
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "32x32",
				href: "/favicon-32x32.png",
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "16x16",
				href: "/favicon-16x16.png",
			},
			{
				rel: "apple-touch-icon",
				sizes: "180x180",
				href: "/apple-touch-icon.png",
			},
			{
				rel: "manifest",
				href: "/manifest.json",
			},
			{
				rel: "preconnect",
				href: "https://media.tenor.com",
			},
			{
				rel: "dns-prefetch",
				href: "https://media.tenor.com",
			},
		],
		scripts: [
			{
				type: "application/ld+json",
				dangerouslySetInnerHTML: {
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "WebSite",
						name: "Transition Kit",
						url: "https://transition-kit.space",
						description:
							"Pre-built, copy-paste page and theme transition and theme toggle components using the View Transitions API.",
						applicationCategory: "DeveloperApplication",
						operatingSystem: "All",
						potentialAction: {
							"@type": "SearchAction",
							target: {
								"@type": "EntryPoint",
								urlTemplate:
									"https://transition-kit.space/templates?q={search_term_string}",
							},
							"query-input": "required name=search_term_string",
						},
					}),
				},
			},
			{
				type: "application/ld+json",
				dangerouslySetInnerHTML: {
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "Organization",
						name: "Transition Kit",
						url: "https://transition-kit.space",
						logo: "https://transition-kit.space/logo512.png",
						sameAs: [],
					}),
				},
			},
			{
				type: "application/ld+json",
				dangerouslySetInnerHTML: {
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "SoftwareApplication",
						name: "Transition Kit",
						url: "https://transition-kit.space",
						description:
							"Pre-built, copy-paste page transition and theme toggle components using the View Transitions API.",
						applicationCategory: "DeveloperApplication",
						operatingSystem: "Web",
						offers: {
							"@type": "Offer",
							price: "0",
							priceCurrency: "USD",
						},
					}),
				},
			},
		],
	}),
	loader: () => getThemeServerFn(),
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	const theme = Route.useLoaderData();
	const location = useRouterState({ select: (s) => s.location });
	const isDocs = location.pathname.startsWith("/components");
	const isTemplates = location.pathname.startsWith("/templates");
	const isTransition = location.pathname.startsWith("/transition");
	const isApp = isDocs || isTemplates || isTransition;

	return (
		<html className={theme} lang="en" suppressHydrationWarning>
			<head>
				<script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
				<HeadContent />
			</head>
			<body className="font-sans antialiased overflow-x-hidden">
				{isApp ? (
					<RootProvider>
						{children}
						<TanStackDevtools
							config={{
								position: "bottom-right",
							}}
							plugins={[
								{
									name: "Tanstack Router",
									render: <TanStackRouterDevtoolsPanel />,
								},
							]}
						/>
						<Scripts />
					</RootProvider>
				) : (
					<Container>
						<RootProvider>
							{children}
							<Footer />
							<TanStackDevtools
								config={{
									position: "bottom-right",
								}}
								plugins={[
									{
										name: "Tanstack Router",
										render: <TanStackRouterDevtoolsPanel />,
									},
								]}
							/>
							<Scripts />
						</RootProvider>
					</Container>
				)}
			</body>
		</html>
	);
}
