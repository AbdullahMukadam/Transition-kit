import { createFileRoute, notFound } from '@tanstack/react-router';
import { source } from '@/lib/source';
import { decodeMarkdownUrl } from '@/lib/shared';
import { getLLMText } from '@/lib/get-llm-text';

export const Route = createFileRoute('/components/{$}.md')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const slugs = decodeMarkdownUrl(params._splat?.split('/') ?? []);
        const page = source.getPage(slugs);
        if (!page) throw notFound();

        return new Response(await getLLMText(page), {
          headers: {
            'Content-Type': 'text/markdown',
          },
        });
      },
    },
  },
});
