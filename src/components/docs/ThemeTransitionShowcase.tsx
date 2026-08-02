"use client";

import { transitions } from "#/data/transitions";
import { AnimatedThemeToggler } from "#/registry/animated-theme-toggler";
import { ThemeSwitcher } from "#/registry/theme-switcher";
import { ThemeToggleButton } from "#/registry/theme-toggle-button";
import { ThemeToggleSwitch } from "#/registry/theme-toggle-switch";
import ComponentShowcase from "./ComponentShowcase";

const themeTransitions = transitions.filter((t) => t.type === "theme");
const variants = themeTransitions.map((t) => ({
	value: t.slug,
	label: t.name,
}));

export function AnimatedThemeTogglerShowcase() {
	return (
		<ComponentShowcase
			name="AnimatedThemeToggler"
			description="Sun/Moon icon button with transition animations"
			variants={variants}
			renderVariant={(v) => <AnimatedThemeToggler transition={v} />}
			installCode="npx shadcn@latest add @transitions/animated-theme-toggler"
			usageCode={(
				v,
			) => `import { AnimatedThemeToggler } from "@/registry/animated-theme-toggler";

<AnimatedThemeToggler transition="${v}" />`}
		/>
	);
}

export function ThemeToggleButtonShowcase() {
	return (
		<ComponentShowcase
			name="ThemeToggleButton"
			description="Text-cycling button with transition animations"
			variants={variants}
			renderVariant={(v) => <ThemeToggleButton transition={v} />}
			installCode="npx shadcn@latest add @transitions/theme-toggle-button"
			usageCode={(
				v,
			) => `import { ThemeToggleButton } from "@/registry/theme-toggle-button";

<ThemeToggleButton transition="${v}" />`}
		/>
	);
}

export function ThemeToggleSwitchShowcase() {
	return (
		<ComponentShowcase
			name="ThemeToggleSwitch"
			description="iOS-style toggle with transition animations"
			variants={variants}
			renderVariant={(v) => <ThemeToggleSwitch transition={v} />}
			installCode="npx shadcn@latest add @transitions/theme-toggle-switch"
			usageCode={(
				v,
			) => `import { ThemeToggleSwitch } from "@/registry/theme-toggle-switch";

<ThemeToggleSwitch transition="${v}" />`}
		/>
	);
}

export function ThemeSwitcherShowcase() {
	return (
		<ComponentShowcase
			name="ThemeSwitcher"
			description="System/Light/Dark segmented switcher with transition animations"
			variants={variants}
			renderVariant={(v) => <ThemeSwitcher transition={v} />}
			installCode="npx shadcn@latest add @transitions/theme-switcher"
			usageCode={(
				v,
			) => `import { ThemeSwitcher } from "@/registry/theme-switcher";

<ThemeSwitcher transition="${v}" />`}
		/>
	);
}
