<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { getCurrentTheme, TRANSITION_CSS, triggerLiveTransition } from "./ThemeToggleSwitchVanilla";

	interface Props {
		transition?: string;
		css?: string;
		duration?: number;
		easing?: string;
	}

	let { transition = "fade", css, duration, easing }: Props = $props();

	let isDark = $state(false);
	let observer: MutationObserver | null = null;

	function toggleTheme() {
		const t = TRANSITION_CSS[transition];
		const resolvedCSS = css ?? t;
		if (resolvedCSS) {
			const resolvedDuration = duration ?? (t ? undefined : 300);
			const resolvedEasing = easing ?? (t ? undefined : "ease-in-out");
			triggerLiveTransition(
				resolvedCSS,
				resolvedDuration,
				resolvedEasing,
			);
		}
		isDark = getCurrentTheme() === "dark";
	}

	onMount(() => {
		isDark = getCurrentTheme() === "dark";
		observer = new MutationObserver(() => {
			isDark = getCurrentTheme() === "dark";
		});
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["class"],
		});
	});

	onDestroy(() => {
		observer?.disconnect();
	});
</script>

<button
	type="button"
	role="switch"
	aria-checked={isDark}
	onclick={toggleTheme}
	style="display: inline-flex; align-items: center; width: 2.75rem; height: 1.5rem; flex-shrink: 0; cursor: pointer; border-radius: 9999px; border: 2px solid transparent; background-color: {isDark ? 'var(--foreground)' : 'var(--muted)'}; transition: background-color 0.15s; outline: none;"
>
	<span
		style="pointer-events: none; display: block; width: 1.25rem; height: 1.25rem; border-radius: 9999px; background-color: var(--background); box-shadow: 0 1px 3px rgba(0,0,0,0.1); transition: transform 0.15s; transform: {isDark ? 'translateX(1.25rem)' : 'translateX(0)'};"
	/>
	<span style="position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0;">Toggle theme</span>
</button>
