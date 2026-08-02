import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = resolve(import.meta.dirname, "..");
const SRC = resolve(ROOT, "src");
const TEMPLATES = resolve(ROOT, "scripts/templates");

// Import TRANSITION_CSS directly from the single source of truth
const { TRANSITION_CSS } = await import(
	pathToFileURL(resolve(SRC, "data/transitions.ts")).href
);

// ── Generate TRANSITION_CSS entries (no wrapper) ───────────────────

function buildTransitionCSSEntries(cssMap: Record<string, string>): string {
	return Object.entries(cssMap)
		.map(([slug, css]) => {
			const escaped = css.replace(/`/g, "\\`");
			return `\t"${slug}": \`\n${escaped}\n\t\``;
		})
		.join(",\n");
}

// ── Build: read source, inline shared, produce standalone ──────────

type Framework = "react" | "vue" | "svelte" | "vanilla";

interface ComponentConfig {
	name: string;
	pascalName: string;
	frameworks: Framework[];
}

const COMPONENTS: ComponentConfig[] = [
	{ name: "animated-theme-toggler", pascalName: "AnimatedThemeToggler", frameworks: ["react", "vue", "svelte", "vanilla"] },
	{ name: "theme-toggle-button", pascalName: "ThemeToggleButton", frameworks: ["react", "vue", "svelte", "vanilla"] },
	{ name: "theme-toggle-switch", pascalName: "ThemeToggleSwitch", frameworks: ["react", "vue", "svelte", "vanilla"] },
	{ name: "theme-switcher", pascalName: "ThemeSwitcher", frameworks: ["react", "vue", "svelte", "vanilla"] },
];

function getTemplateExtension(f: Framework): string {
	switch (f) {
		case "react": return ".tsx";
		case "vue": return ".vue";
		case "svelte": return ".svelte";
		case "vanilla": return ".ts";
	}
}

function getOutputExtension(f: Framework): string {
	return getTemplateExtension(f);
}

function makeStandalone(
	vanillaContent: string,
	frameworkContent: string,
	framework: Framework,
): string {
	const sharedCode = readFileSync(resolve(TEMPLATES, "shared.ts"), "utf-8");
	const inlinedShared = sharedCode.replace(/^export /gm, "").trim();

	// Remove shared import from vanilla code
	const vanillaBody = vanillaContent
		.replace(/import \{[^}]+\} from "\.\.\/shared";\n?/, "")
		.trim();

	if (framework === "vanilla") {
		return inlinedShared + "\n\n" + vanillaBody;
	}

	// For framework wrappers: replace the vanilla engine import with inlined shared + vanilla body
	const frameworkBody = frameworkContent
		.replace(/import \{[^}]+\} from "\.\/[^"]+";\n?/, "")
		.trim();

	if (framework === "react") {
		return [
			'"use client";',
			"",
			inlinedShared,
			"",
			vanillaBody,
			"",
			frameworkBody,
		].join("\n\n");
	}

	// Vue: replace vanilla import inside <script setup> with inlined shared + vanilla
	if (framework === "vue") {
		return frameworkContent.replace(
			/import \{[^}]+\} from "\.\/[^"]+";/,
			`// --- inlined shared + vanilla engine ---\n${inlinedShared}\n\n${vanillaBody}\n// --- end inlined ---`,
		);
	}

	// Svelte: replace vanilla import inside <script> with inlined shared + vanilla
	if (framework === "svelte") {
		return frameworkContent.replace(
			/import \{[^}]+\} from "\.\/[^"]+";/,
			`// --- inlined shared + vanilla engine ---\n${inlinedShared}\n\n${vanillaBody}\n// --- end inlined ---`,
		);
	}

	return frameworkContent;
}

function buildRegistryFiles(transitionCSSEntries: string) {
	for (const component of COMPONENTS) {
		const componentDir = resolve(TEMPLATES, component.name);

		for (const framework of component.frameworks) {
			const ext = getTemplateExtension(framework);
			const vanillaExt = getTemplateExtension("vanilla");

			// Read vanilla engine
			const vanillaPath = resolve(componentDir, `${component.pascalName}Vanilla${vanillaExt}`);
			const vanillaContent = readFileSync(vanillaPath, "utf-8");

			// Read framework wrapper (or use vanilla content for vanilla framework)
			let frameworkContent: string;
			if (framework === "vanilla") {
				frameworkContent = vanillaContent;
			} else {
				const frameworkPath = resolve(componentDir, `${component.pascalName}${ext}`);
				frameworkContent = readFileSync(frameworkPath, "utf-8");
			}

			// Build standalone output
			const standalone = makeStandalone(vanillaContent, frameworkContent, framework);

			// Replace placeholder in vanilla engine with actual entries
			const output = standalone.replace(/\{\{TRANSITION_CSS_ENTRIES\}\}/g, transitionCSSEntries);

			// Write output
			const outputName = `${component.name}${getOutputExtension(framework)}`;
			const outputDir =
				framework === "react"
					? resolve(SRC, "registry")
					: resolve(SRC, "registry", framework);
			mkdirSync(outputDir, { recursive: true });
			writeFileSync(resolve(outputDir, outputName), output);
			console.log(`  ✓ src/registry/${framework === "react" ? "" : `${framework}/`}${outputName}`);
		}
	}
}

// ── Update MDX manual install code blocks ──────────────────────────

interface MDXConfig {
	mdxPath: string;
	componentName: string;
	pascalName: string;
	frameworks: {
		framework: Framework;
		codeBlockTitle: string;
	}[];
}

function updateMDXManualCode(
	transitionCSSEntries: string,
	configs: MDXConfig[],
) {
	const START_MARKER = "{/* @build-registry:start */}";
	const END_MARKER = "{/* @build-registry:end */}";

	for (const config of configs) {
		const mdxFull = resolve(ROOT, config.mdxPath);
		let mdxContent = readFileSync(mdxFull, "utf-8");
		const componentDir = resolve(TEMPLATES, config.componentName);

		// Process each marker pair sequentially
		let searchFrom = 0;
		for (const fw of config.frameworks) {
			const startIdx = mdxContent.indexOf(START_MARKER, searchFrom);
			const endIdx = mdxContent.indexOf(END_MARKER, searchFrom);

			if (startIdx === -1 || endIdx === -1) {
				console.warn(`  ⚠ No more marker pairs in ${config.mdxPath} (processed up to ${fw.framework})`);
				break;
			}

			try {
				const ext = getTemplateExtension(fw.framework);
				const vanillaExt = getTemplateExtension("vanilla");

				// Read vanilla engine
				const vanillaPath = resolve(componentDir, `${config.pascalName}Vanilla${vanillaExt}`);
				const vanillaContent = readFileSync(vanillaPath, "utf-8");

				// Read framework wrapper
				let frameworkContent: string;
				if (fw.framework === "vanilla") {
					frameworkContent = vanillaContent;
				} else {
					const frameworkPath = resolve(componentDir, `${config.pascalName}${ext}`);
					frameworkContent = readFileSync(frameworkPath, "utf-8");
				}

				// Build standalone + replace placeholder
				const standalone = makeStandalone(vanillaContent, frameworkContent, fw.framework);
				const componentCode = standalone.replace(/\{\{TRANSITION_CSS_ENTRIES\}\}/g, transitionCSSEntries);

				const codeBlock = [
					`\`\`\`${ext.slice(1)} title="${fw.codeBlockTitle}"`,
					componentCode,
					"```",
				].join("\n");

				const replacement =
					START_MARKER +
					"\n" +
					codeBlock +
					"\n" +
					END_MARKER;
				mdxContent =
					mdxContent.slice(0, startIdx) +
					replacement +
					mdxContent.slice(endIdx + END_MARKER.length);
				searchFrom = startIdx + replacement.length;
			} catch (error) {
				console.warn(`  ⚠ Could not process ${config.componentName} ${fw.framework}: ${error}`);
			}
		}

		writeFileSync(mdxFull, mdxContent);
		console.log(`  ✓ ${config.mdxPath}`);
	}
}

// ── Main ───────────────────────────────────────────────────────────

console.log("Building registry components...\n");
console.log(`Found ${Object.keys(TRANSITION_CSS).length} transitions\n`);

const transitionCSSEntries = buildTransitionCSSEntries(TRANSITION_CSS);

console.log("Generating registry files:");
buildRegistryFiles(transitionCSSEntries);

console.log("\nUpdating MDX manual install code:");
updateMDXManualCode(transitionCSSEntries, [
	{
		mdxPath: "content/docs/theme/animated-theme-toggler.mdx",
		componentName: "animated-theme-toggler",
		pascalName: "AnimatedThemeToggler",
		frameworks: [
			{ framework: "react", codeBlockTitle: "src/components/AnimatedThemeToggler.tsx" },
			{ framework: "vue", codeBlockTitle: "src/components/AnimatedThemeToggler.vue" },
			{ framework: "svelte", codeBlockTitle: "src/components/AnimatedThemeToggler.svelte" },
			{ framework: "vanilla", codeBlockTitle: "src/components/AnimatedThemeToggler.ts" },
		],
	},
	{
		mdxPath: "content/docs/theme/theme-toggle-button.mdx",
		componentName: "theme-toggle-button",
		pascalName: "ThemeToggleButton",
		frameworks: [
			{ framework: "react", codeBlockTitle: "src/components/ThemeToggleButton.tsx" },
			{ framework: "vue", codeBlockTitle: "src/components/ThemeToggleButton.vue" },
			{ framework: "svelte", codeBlockTitle: "src/components/ThemeToggleButton.svelte" },
			{ framework: "vanilla", codeBlockTitle: "src/components/ThemeToggleButton.ts" },
		],
	},
	{
		mdxPath: "content/docs/theme/theme-toggle-switch.mdx",
		componentName: "theme-toggle-switch",
		pascalName: "ThemeToggleSwitch",
		frameworks: [
			{ framework: "react", codeBlockTitle: "src/components/ThemeToggleSwitch.tsx" },
			{ framework: "vue", codeBlockTitle: "src/components/ThemeToggleSwitch.vue" },
			{ framework: "svelte", codeBlockTitle: "src/components/ThemeToggleSwitch.svelte" },
			{ framework: "vanilla", codeBlockTitle: "src/components/ThemeToggleSwitch.ts" },
		],
	},
	{
		mdxPath: "content/docs/theme/theme-switcher.mdx",
		componentName: "theme-switcher",
		pascalName: "ThemeSwitcher",
		frameworks: [
			{ framework: "react", codeBlockTitle: "src/components/ThemeSwitcher.tsx" },
			{ framework: "vue", codeBlockTitle: "src/components/ThemeSwitcher.vue" },
			{ framework: "svelte", codeBlockTitle: "src/components/ThemeSwitcher.svelte" },
			{ framework: "vanilla", codeBlockTitle: "src/components/ThemeSwitcher.ts" },
		],
	},
]);

console.log("\nDone! All registry components and MDX docs are in sync.");
