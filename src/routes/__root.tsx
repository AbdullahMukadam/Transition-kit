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
				title: "Transition Kit | Page Transition Templates",
			},
			{
				name: "description",
				content:
					"Pre-built, copy-paste page transition and theme toggle components using the View Transitions API. Fade, slide, scale, flip, blur, mask reveals, and more.",
			},
			{
				name: "keywords",
				content:
					"view transitions, page transitions, theme toggle, CSS animations, React components, shadcn, fumadocs",
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
				property: "og:title",
				content: "Transition Kit | Page Transition Templates",
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
				content: "https://transition-kit.space/og-image.png",
			},
			{
				name: "twitter:card",
				content: "summary_large_image",
			},
			{
				name: "twitter:title",
				content: "Transition Kit | Page Transition Templates",
			},
			{
				name: "twitter:description",
				content:
					"Pre-built, copy-paste page transition and theme toggle components using the View Transitions API.",
			},
			{
				name: "twitter:image",
				content: "https://transition-kit.space/og-image.png",
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
							"Pre-built, copy-paste page transition and theme toggle components using the View Transitions API.",
						applicationCategory: "DeveloperApplication",
						operatingSystem: "All",
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
							<Header />
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
