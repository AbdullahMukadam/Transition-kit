import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import browserCollections from "collections/browser";
import { useFumadocsLoader } from "fumadocs-core/source/client";
import type { TOCItemType } from "fumadocs-core/toc";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import {
	DocsBody,
	DocsDescription,
	DocsPage,
	DocsTitle,
} from "fumadocs-ui/layouts/docs/page";
import type { ReactNode } from "react";
import { Suspense } from "react";
import {
	MarkdownCopyButton,
	ViewOptionsPopover,
} from "#/components/ai/page-actions";
import { useMDXComponents } from "#/components/docs/mdx";
import { baseOptions } from "#/lib/layout.shared";
import { encodeMarkdownUrl } from "#/lib/shared";
import { source } from "#/lib/source";

function extractText(node: ReactNode): string {
	if (typeof node === "string") return node;
	if (typeof node === "number") return String(node);
	if (!node || typeof node !== "object") return "";
	if (
		"props" in node &&
		node.props &&
		typeof node.props === "object" &&
		"children" in node.props
	)
		return extractText(node.props.children as ReactNode);
	if (Array.isArray(node)) return node.map(extractText).join("");
	return "";
}

export const Route = createFileRoute("/components/$")({
	component: Page,
	loader: async ({ params }) => {
		const slugs = params._splat?.split("/") ?? [];
		const data = await serverLoader({ data: slugs });
		await clientLoader.preload(data.path);
		return data;
	},
	head: ({ loaderData }) => {
		if (!loaderData) return {};
		return {
			meta: [
				{ title: `${loaderData.title} | Transition Kit` },
				{ name: "description", content: loaderData.description },
				{
					name: "keywords",
					content:
						"view transitions api, css transitions, theme transition, page transition, react component, shadcn ui, copy paste component",
				},
				{
					property: "og:title",
					content: `${loaderData.title} | Transition Kit`,
				},
				{ property: "og:description", content: loaderData.description },
				{
					property: "og:type",
					content: "article",
				},
				{
					property: "og:image",
					content: "https://transition-kit.space/og-image.webp",
				},
				{
					name: "twitter:title",
					content: `${loaderData.title} | Transition Kit`,
				},
				{ name: "twitter:description", content: loaderData.description },
				{
					name: "twitter:image",
					content: "https://transition-kit.space/og-image.webp",
				},
			],
			links: [
				{
					rel: "canonical",
					href: `https://transition-kit.space${loaderData.url}`,
				},
			],
		};
	},
});

const serverLoader = createServerFn({
	method: "GET",
})
	.validator((slugs: string[]) => slugs)
	.handler(async ({ data: slugs }) => {
		const page = source.getPage(slugs);
		if (!page) throw notFound();

		return {
			title: page.data.title ?? "",
			description: page.data.description ?? "",
			url: page.url,
			toc: page.data.toc.map((item) => ({
				title: extractText(item.title),
				url: item.url,
				depth: item.depth,
			})),
			path: page.path,
			slugs: page.slugs,
			pageTree: await source.serializePageTree(source.getPageTree()),
		};
	});

const clientLoader = browserCollections.docs.createClientLoader({
	component(
		{ frontmatter, default: MDX },
		props: { toc: TOCItemType[]; slugs: string[] },
	) {
		return (
			<DocsPage toc={props.toc}>
				<DocsTitle>{frontmatter.title}</DocsTitle>
				<DocsDescription>{frontmatter.description}</DocsDescription>
				<div className="flex flex-row gap-2 items-center border-b pb-6">
					<MarkdownCopyButton markdownUrl={encodeMarkdownUrl(props.slugs)} />
					<ViewOptionsPopover markdownUrl={encodeMarkdownUrl(props.slugs)} />
				</div>
				<DocsBody>
					<MDX components={useMDXComponents()} />
				</DocsBody>
			</DocsPage>
		);
	},
});

function Page() {
	const data = useFumadocsLoader(Route.useLoaderData());

	return (
		<DocsLayout {...baseOptions()} tree={data.pageTree}>
			<Suspense>
				{clientLoader.useContent(data.path, {
					toc: data.toc,
					slugs: data.slugs,
				})}
			</Suspense>
		</DocsLayout>
	);
}
