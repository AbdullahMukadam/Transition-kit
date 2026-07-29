import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "fumadocs-ui/components/tabs";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { AnimatedThemeToggler } from "#/registry/animated-theme-toggler";
import { ThemeToggleButton } from "#/registry/theme-toggle-button";
import { ThemeToggleSwitch } from "#/registry/theme-toggle-switch";
import {
	TabsContent as ShadcnContent,
	TabsList as ShadcnTabList,
	Tabs as ShadcnTabs,
	TabsTrigger as ShadcnTrigger,
} from "@/components/ui/tabs";
import Container from "../layout/Container";
import { CopyBlock, TransitionDemo } from "./ComponentPreview";
import ComponentShowcase from "./ComponentShowcase";
import { BunIcon, NpmIcon, PnpmIcon, YarnIcon } from "./PackageIcons";
import {
	AnimatedThemeTogglerShowcase,
	ThemeToggleButtonShowcase,
	ThemeToggleSwitchShowcase,
} from "./ThemeTransitionShowcase";
import TransitionGridMDX from "./TransitionGridMDX";
import { TransitionsTable } from "./TransitionsTable";

export function getMDXComponents(components?: MDXComponents) {
	return {
		...defaultMdxComponents,
		Tabs,
		TabsList,
		TabsTrigger,
		TabsContent,
		NpmIcon,
		PnpmIcon,
		YarnIcon,
		BunIcon,
		ComponentShowcase,
		TransitionGridMDX,
		TransitionsTable,
		AnimatedThemeTogglerShowcase,
		ThemeToggleButtonShowcase,
		ThemeToggleSwitchShowcase,
		TransitionDemo,
		CopyBlock,
		AnimatedThemeToggler,
		ThemeToggleButton,
		ThemeToggleSwitch,
		ShadcnTabs,
		ShadcnContent,
		ShadcnTabList,
		ShadcnTrigger,
		Container,
		...components,
	} satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
	type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
