<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { getCurrentTheme, TRANSITION_CSS, triggerLiveTransition } from "./ThemeToggleSwitchVanilla";

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
	isDark.value = getCurrentTheme() === "dark";
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
		role="switch"
		:aria-checked="isDark"
		@click="toggleTheme"
		:style="{
			display: 'inline-flex',
			alignItems: 'center',
			width: '2.75rem',
			height: '1.5rem',
			flexShrink: '0',
			cursor: 'pointer',
			borderRadius: '9999px',
			border: '2px solid transparent',
			backgroundColor: isDark ? 'var(--foreground)' : 'var(--muted)',
			transition: 'background-color 0.15s',
			outline: 'none',
		}"
	>
		<span
			:style="{
				pointerEvents: 'none',
				display: 'block',
				width: '1.25rem',
				height: '1.25rem',
				borderRadius: '9999px',
				backgroundColor: 'var(--background)',
				boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
				transition: 'transform 0.15s',
				transform: isDark ? 'translateX(1.25rem)' : 'translateX(0)',
			}"
		/>
		<span style="position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0;">Toggle theme</span>
	</button>
</template>
