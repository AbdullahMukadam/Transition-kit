<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { getThemeOption, switchTheme, type ThemeOption } from "./ThemeSwitcherVanilla";

interface Props {
	transition?: string;
	css?: string;
	duration?: number;
	easing?: string;
}

const props = withDefaults(defineProps<Props>(), {
	transition: "fade",
});

const MONITOR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>`;
const SUN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`;
const MOON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;

const THEMES: { key: ThemeOption; label: string; icon: string }[] = [
	{ key: "system", label: "System theme", icon: MONITOR_SVG },
	{ key: "light", label: "Light theme", icon: SUN_SVG },
	{ key: "dark", label: "Dark theme", icon: MOON_SVG },
];

const option = ref<ThemeOption>("system");
let observer: MutationObserver | null = null;

const activeIndex = computed(() =>
	Math.max(0, THEMES.findIndex((t) => t.key === option.value)),
);

function selectTheme(key: ThemeOption) {
	switchTheme(key, {
		transition: props.transition,
		css: props.css,
		duration: props.duration,
		easing: props.easing,
	});
	option.value = key;
}

onMounted(() => {
	option.value = getThemeOption();
	observer = new MutationObserver(() => {
		option.value = getThemeOption();
	});
	observer.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ["class"],
	});
});

onUnmounted(() => {
	observer?.disconnect();
});
</script>

<template>
	<div
		role="group"
		aria-label="Theme switcher"
		:style="{
			position: 'relative',
			display: 'inline-flex',
			alignItems: 'center',
			borderRadius: '9999px',
			border: '1px solid var(--border)',
			backgroundColor: 'var(--background)',
			padding: '0.25rem',
		}"
	>
		<span
			aria-hidden="true"
			:style="{
				position: 'absolute',
				top: '0.25rem',
				left: '0.25rem',
				width: '1.5rem',
				height: '1.5rem',
				borderRadius: '9999px',
				backgroundColor: 'var(--muted)',
				transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
				transform: `translateX(${activeIndex * 24}px)`,
			}"
		/>
		<button
			v-for="theme in THEMES"
			:key="theme.key"
			type="button"
			:aria-label="theme.label"
			:aria-pressed="option === theme.key"
			@click="selectTheme(theme.key)"
			:style="{
				position: 'relative',
				display: 'inline-flex',
				alignItems: 'center',
				justifyContent: 'center',
				width: '1.5rem',
				height: '1.5rem',
				borderRadius: '9999px',
				color: option === theme.key ? 'var(--foreground)' : 'var(--muted-foreground)',
				cursor: 'pointer',
				transition: 'color 0.15s',
			}"
		>
			<span v-html="theme.icon" />
		</button>
	</div>
</template>
