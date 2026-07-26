"use client";

import { transitions } from "#/data/transitions";
import { AnimatedThemeToggler } from "#/registry/animated-theme-toggler";
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
			usageCode={`import { AnimatedThemeToggler } from "@/registry/animated-theme-toggler";

// Basic — uses the built-in "fade" transition
<AnimatedThemeToggler />

// Choose a built-in transition
<AnimatedThemeToggler transition="circle-reveal" />

// Custom CSS, duration, and easing
<AnimatedThemeToggler
  css={myCustomCSS}
  duration={800}
  easing="cubic-bezier(0.16, 1, 0.3, 1)"
/>`}
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
			usageCode={`import { ThemeToggleButton } from "@/registry/theme-toggle-button";

// Basic — uses the built-in "fade" transition
<ThemeToggleButton />

// Choose a built-in transition
<ThemeToggleButton transition="circle-blur" />

// Custom CSS, duration, and easing
<ThemeToggleButton
  css={myCustomCSS}
  duration={800}
  easing="cubic-bezier(0.16, 1, 0.3, 1)"
/>`}
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
			usageCode={`import { ThemeToggleSwitch } from "@/registry/theme-toggle-switch";

// Basic — uses the built-in "fade" transition
<ThemeToggleSwitch />

// Choose a built-in transition
<ThemeToggleSwitch transition="polygon-reveal" />

// Custom CSS, duration, and easing
<ThemeToggleSwitch
  css={myCustomCSS}
  duration={800}
  easing="cubic-bezier(0.16, 1, 0.3, 1)"
/>`}
		/>
	);
}
