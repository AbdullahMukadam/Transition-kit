import { templates } from "collections/server";
import { loader } from "fumadocs-core/source";

export const templatesSource = loader({
	baseUrl: "/templates",
	source: templates.toFumadocsSource(),
});
