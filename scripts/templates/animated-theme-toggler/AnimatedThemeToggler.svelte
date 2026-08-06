<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { getCurrentTheme, TRANSITION_CSS, triggerLiveTransition } from "./AnimatedThemeTogglerVanilla";

	interface Props {
		transition?: string;
		css?: string;
		duration?: number;
		easing?: string;
	}

	let { transition = "fade", css, duration, easing }: Props = $props();

	let isDark = $state(false);
	let observer: MutationObserver | null = null;

	const SUN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`;
	const MOON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;

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
	aria-label="Toggle theme"
	onclick={toggleTheme}
	style="display: inline-flex; align-items: center; justify-content: center; border-radius: 0.375rem; border: 1px solid var(--border); background-color: var(--background); padding: 0.5rem; color: var(--foreground); cursor: pointer; transition: background-color 0.15s;"
>
	{@html isDark ? SUN_SVG : MOON_SVG}
	<span style="position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0;">Toggle theme</span>
</button>
