<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { getCurrentTheme, TRANSITION_CSS, triggerLiveTransition } from "./AnimatedThemeTogglerVanilla";

interface Props {
	transition?: string;
	css?: string;
	duration?: number;
	easing?: string;
}

const props = withDefaults(defineProps<Props>(), {
	transition: "fade",
});

const isDark = ref(false);
let observer: MutationObserver | null = null;

const SUN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`;
const MOON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;

function toggleTheme() {
	const t = TRANSITION_CSS[props.transition];
	const resolvedCSS = props.css ?? t;
	if (resolvedCSS) {
		const resolvedDuration = props.duration ?? (t ? undefined : 300);
		const resolvedEasing = props.easing ?? (t ? undefined : "ease-in-out");
		triggerLiveTransition(
			resolvedCSS,
			resolvedDuration ?? 300,
			resolvedEasing ?? "ease-in-out",
		);
	}
	isDark.value = getCurrentTheme() === "light";
}

onMounted(() => {
	isDark.value = getCurrentTheme() === "dark";
	observer = new MutationObserver(() => {
		isDark.value = getCurrentTheme() === "dark";
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
	<button
		type="button"
		@click="toggleTheme"
		:style="{
			display: 'inline-flex',
			alignItems: 'center',
			justifyContent: 'center',
			borderRadius: '0.375rem',
			border: '1px solid var(--border)',
			backgroundColor: 'var(--background)',
			padding: '0.5rem',
			color: 'var(--foreground)',
			cursor: 'pointer',
			transition: 'background-color 0.15s',
		}"
	>
		<span v-if="isDark" v-html="SUN_SVG" />
		<span v-else v-html="MOON_SVG" />
		<span class="sr-only">Toggle theme</span>
	</button>
</template>
