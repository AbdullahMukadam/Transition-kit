export const EMBED_MESSAGE_SOURCE = "transition-kit";

export interface EmbedTriggerMessage {
	source: typeof EMBED_MESSAGE_SOURCE;
	type: "trigger";
	kind: "theme" | "page";
	css: string;
}

export function buildEmbedSnippet(): string {
	return `<!-- Add inside <head> -->
<script src="https://transition-kit.space/live-preview.min.js"></script>`;
}
