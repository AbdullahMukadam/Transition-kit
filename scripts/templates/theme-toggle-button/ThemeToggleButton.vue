<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { getCurrentTheme, TRANSITION_CSS, triggerLiveTransition } from "./ThemeToggleButtonVanilla";

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
			gap: '0.5rem',
			borderRadius: '0.375rem',
			border: '1px solid var(--border)',
			backgroundColor: 'var(--background)',
			paddingLeft: '0.75rem',
			paddingRight: '0.75rem',
			paddingTop: '0.375rem',
			paddingBottom: '0.375rem',
			fontSize: '0.875rem',
			fontWeight: '500',
			color: 'var(--foreground)',
			cursor: 'pointer',
			transition: 'background-color 0.15s',
		}"
	>
		{{ isDark ? "Light" : "Dark" }}
		<span class="sr-only">Toggle theme</span>
	</button>
</template>
