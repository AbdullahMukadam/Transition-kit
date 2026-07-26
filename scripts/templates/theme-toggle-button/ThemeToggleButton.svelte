<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { getCurrentTheme, TRANSITION_CSS, triggerLiveTransition } from "./ThemeToggleButtonVanilla";

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
				resolvedDuration ?? 300,
				resolvedEasing ?? "ease-in-out",
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
	aria-label="Toggle theme"
	onclick={toggleTheme}
	style="display: inline-flex; align-items: center; gap: 0.5rem; border-radius: 0.375rem; border: 1px solid var(--border); background-color: var(--background); padding: 0.375rem 0.75rem; font-size: 0.875rem; font-weight: 500; color: var(--foreground); cursor: pointer; transition: background-color 0.15s;"
>
	{isDark ? "Light" : "Dark"}
	<span style="position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0;">Toggle theme</span>
</button>
