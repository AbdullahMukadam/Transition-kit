import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import browserCollections from "collections/browser";
import { useFumadocsLoader } from "fumadocs-core/source/client";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/layouts/docs/page";
import { Suspense } from "react";
import { useMDXComponents } from "#/components/docs/mdx";
import { baseOptions } from "#/lib/layout.shared";
import { templatesSource } from "#/lib/templates-source";
import Container from "#/components/layout/Container";

export const Route = createFileRoute("/templates/")({
  component: Page,
  loader: async () => {
    const data = await serverLoader({ data: [] });
    await clientLoader.preload(data.path);
    return data;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    return {
      meta: [
        { title: `${loaderData.title} — Transition Kit` },
        { name: "description", content: loaderData.description },
        { property: "og:title", content: `${loaderData.title} — Transition Kit` },
        { property: "og:description", content: loaderData.description },
        { name: "twitter:title", content: `${loaderData.title} — Transition Kit` },
        { name: "twitter:description", content: loaderData.description },
      ],
      links: [{ rel: "canonical", href: `https://transition-kit.vercel.app${loaderData.url}` }],
    };
  },
});

const serverLoader = createServerFn({
  method: "GET",
})
  .validator((slugs: string[]) => slugs)
  .handler(async ({ data: slugs }) => {
    const page = templatesSource.getPage(slugs);
    if (!page) {
      throw new Error("Templates index page not found");
    }

    return {
      title: page.data.title ?? "",
      description: page.data.description ?? "",
      url: page.url,
      path: page.path,
      pageTree: await templatesSource.serializePageTree(
        templatesSource.getPageTree()
      ),
    };
  });

const clientLoader = browserCollections.templates.createClientLoader({
  component({ frontmatter, default: MDX }, _props: undefined) {
    return (
      <Container className="h-screen">
        <DocsPage toc={undefined} tableOfContent={{ enabled: false }}>
          <DocsTitle>{frontmatter.title}</DocsTitle>
          <DocsDescription>{frontmatter.description}</DocsDescription>
          <DocsBody>
            <MDX components={useMDXComponents()} />
          </DocsBody>
        </DocsPage>
      </Container>
    );
  },
});

function Page() {
  const data = useFumadocsLoader(Route.useLoaderData());

  return (
    <DocsLayout {...baseOptions()} tree={data.pageTree}>
      <Suspense>{clientLoader.useContent(data.path)}</Suspense>
    </DocsLayout>
  );
}
