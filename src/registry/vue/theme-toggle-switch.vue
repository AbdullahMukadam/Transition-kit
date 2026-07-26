<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
// --- inlined shared + vanilla engine ---
function getCurrentTheme(): "light" | "dark" {
	const el = document.documentElement;
	if (el.classList.contains("dark")) return "dark";
	if (el.classList.contains("light")) return "light";
	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

function setTheme(theme: "light" | "dark") {
	const el = document.documentElement;
	el.classList.remove("light", "dark");
	el.classList.add(theme);
	el.style.colorScheme = theme;
	localStorage.setItem("theme", theme);
	document.cookie = `_preferred-theme=${theme}; path=/; max-age=31536000`;
}

const TRANSITION_CSS: Record<string, string> = {
		"circle-reveal": `
::view-transition-old(root),
.dark::view-transition-old(root) {
  animation: none;
  animation-fill-mode: both;
  z-index: -1;
}

::view-transition-new(root) {
  mask: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="white"/></svg>')
    center / 0 no-repeat;
  animation: circle-reveal 1s both;
}

.dark::view-transition-new(root) {
  animation: circle-reveal 1s both;
}

@keyframes circle-reveal {
  to {
    mask-size: 200vmax;
  }
}
	`,
	"circle-blur": `
::view-transition-group(root) {
  animation-timing-function: var(--expo-out);
}

::view-transition-old(root),
.dark::view-transition-old(root) {
  animation: none;
  animation-fill-mode: both;
  z-index: -1;
}

::view-transition-new(root) {
  mask: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs><filter id="blur"><feGaussianBlur stdDeviation="2"/></filter></defs><circle cx="20" cy="20" r="18" fill="white" filter="url(%23blur"/></svg>')
    center / 0 no-repeat;
  animation: circle-blur-reveal 1s both;
}

.dark::view-transition-new(root) {
  animation: circle-blur-reveal 1s both;
}

@keyframes circle-blur-reveal {
  to {
    mask-size: 200vmax;
  }
}

@keyframes expo-out {
  0 0%, 0.1684 2.66%, 0.3165 5.49%,
  0.446 8.52%, 0.5581 11.78%,
  0.6535 15.29%, 0.7341 19.11%,
  0.8011 23.3%, 0.8557 27.93%,
  0.8962 32.68%, 0.9283 38.01%,
  0.9529 44.08%, 0.9711 51.14%,
  0.9833 59.06%, 0.9915 68.74%, 1 100%
}
	`,
	"polygon-reveal": `
::view-transition-group(root) {
  animation-duration: 0.7s;
  animation-timing-function: var(--expo-out);
}

::view-transition-old(root),
.dark::view-transition-old(root) {
  animation: none;
  animation-fill-mode: both;
  z-index: -1;
}

::view-transition-new(root) {
  animation-name: polygon-reveal-light;
  animation-fill-mode: both;
}

.dark::view-transition-new(root) {
  animation-name: polygon-reveal-dark;
  animation-fill-mode: both;
}

@keyframes polygon-reveal-dark {
  from {
    clip-path: polygon(50% -71%, -50% 71%, -50% 71%, 50% -71%);
  }
  to {
    clip-path: polygon(50% -71%, -50% 71%, 50% 171%, 171% 50%);
  }
}

@keyframes polygon-reveal-light {
  from {
    clip-path: polygon(171% 50%, 50% 171%, 50% 171%, 171% 50%);
  }
  to {
    clip-path: polygon(171% 50%, 50% 171%, -50% 71%, 50% -71%);
  }
}
	`,
	"gif-frog": `
::view-transition-group(root) {
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}

::view-transition-old(root),
.dark::view-transition-old(root) {
  animation: none;
  animation-fill-mode: both;
  z-index: -1;
}

::view-transition-new(root) {
  mask: url('https://media.tenor.com/jNj-TzGDB9YAAAAm/cute-frog.gif')
    center / 0 no-repeat;
  animation: gif-frog-reveal 1.5s both;
}

.dark::view-transition-new(root) {
  animation: gif-frog-reveal 1.5s both;
}

@keyframes gif-frog-reveal {
  0% {
    mask-size: 0;
  }
  10% {
    mask-size: 50vmax;
  }
  90% {
    mask-size: 50vmax;
  }
  100% {
    mask-size: 2000vmax;
  }
}
	`,
	"gif-penguin": `
::view-transition-group(root) {
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}

::view-transition-old(root),
.dark::view-transition-old(root) {
  animation: none;
  animation-fill-mode: both;
  z-index: -1;
}

::view-transition-new(root) {
  mask: url('https://media.tenor.com/1jHNXbaAAkQAAAAM/happy-dance.gif')
    center / 0 no-repeat;
  animation: gif-penguin-reveal 1.5s both;
}

.dark::view-transition-new(root) {
  animation: gif-penguin-reveal 1.5s both;
}

@keyframes gif-penguin-reveal {
  0% {
    mask-size: 0;
  }
  10% {
    mask-size: 50vmax;
  }
  90% {
    mask-size: 50vmax;
  }
  100% {
    mask-size: 2000vmax;
  }
}
	`,
	"gif-cat": `
::view-transition-group(root) {
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}

::view-transition-old(root),
.dark::view-transition-old(root) {
  animation: none;
  animation-fill-mode: both;
  z-index: -1;
}

::view-transition-new(root) {
  mask: url('https://media.tenor.com/DJdpKAy1lCAAAAAM/dancing.gif')
    center / 0 no-repeat;
  animation: gif-cat-reveal 1.5s both;
}

.dark::view-transition-new(root) {
  animation: gif-cat-reveal 1.5s both;
}

@keyframes gif-cat-reveal {
  0% {
    mask-size: 0;
  }
  10% {
    mask-size: 50vmax;
  }
  90% {
    mask-size: 50vmax;
  }
  100% {
    mask-size: 2000vmax;
  }
}
	`,
	"fade": `
::view-transition-old(root) {
  animation: fade-out 300ms ease-in-out both;
}

::view-transition-new(root) {
  animation: fade-in 300ms ease-in-out both;
}

@keyframes fade-out {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
	`,
	"slide": `
::view-transition-old(root) {
  animation: slide-out 400ms cubic-bezier(0.4, 0, 0.2, 1) both;
}

::view-transition-new(root) {
  animation: slide-in 400ms cubic-bezier(0.4, 0, 0.2, 1) both;
}

@keyframes slide-out {
  from { transform: translateX(0); }
  to { transform: translateX(-100%); }
}

@keyframes slide-in {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
	`,
	"scale": `
::view-transition-old(root) {
  animation: scale-out 500ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

::view-transition-new(root) {
  animation: scale-in 500ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes scale-out {
  from { transform: scale(1); opacity: 1; }
  to { transform: scale(0.8); opacity: 0; }
}

@keyframes scale-in {
  from { transform: scale(1.2); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
	`,
	"flip": `
::view-transition-old(root) {
  animation: flip-out 600ms ease-in-out both;
  transform-origin: left center;
  backface-visibility: hidden;
}

::view-transition-new(root) {
  animation: flip-in 600ms ease-in-out both;
  transform-origin: right center;
  backface-visibility: hidden;
}

@keyframes flip-out {
  from { transform: perspective(1200px) rotateY(0deg); }
  to { transform: perspective(1200px) rotateY(-90deg); }
}

@keyframes flip-in {
  from { transform: perspective(1200px) rotateY(90deg); }
  to { transform: perspective(1200px) rotateY(0deg); }
}
	`,
	"blur": `
::view-transition-old(root) {
  animation: blur-out 500ms ease-in-out both;
}

::view-transition-new(root) {
  animation: blur-in 500ms ease-in-out both;
}

@keyframes blur-out {
  from {
    filter: blur(0px);
    opacity: 1;
    transform: scale(1);
  }
  to {
    filter: blur(12px);
    opacity: 0;
    transform: scale(1.02);
  }
}

@keyframes blur-in {
  from {
    filter: blur(12px);
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    filter: blur(0px);
    opacity: 1;
    transform: scale(1);
  }
}
	`,
	"rotate": `
::view-transition-old(root) {
  animation: rotate-out 500ms cubic-bezier(0.4, 0, 0.2, 1) both;
}

::view-transition-new(root) {
  animation: rotate-in 500ms cubic-bezier(0.4, 0, 0.2, 1) both;
}

@keyframes rotate-out {
  from { transform: rotate(0deg) scale(1); opacity: 1; }
  to { transform: rotate(-10deg) scale(0.9); opacity: 0; }
}

@keyframes rotate-in {
  from { transform: rotate(10deg) scale(0.9); opacity: 0; }
  to { transform: rotate(0deg) scale(1); opacity: 1; }
}
	`,
	"zoom": `
::view-transition-old(root) {
  animation: zoom-out 400ms cubic-bezier(0.4, 0, 0.2, 1) both;
}

::view-transition-new(root) {
  animation: zoom-in 400ms cubic-bezier(0.4, 0, 0.2, 1) both;
}

@keyframes zoom-out {
  from { transform: scale(1); opacity: 1; }
  to { transform: scale(0.5); opacity: 0; }
}

@keyframes zoom-in {
  from { transform: scale(2); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
	`
};

let activeStyle: HTMLStyleElement | null = null;

function triggerLiveTransition(css: string, duration: number, easing: string) {
	if (activeStyle) {
		activeStyle.remove();
		activeStyle = null;
	}

	const style = document.createElement("style");
	const customCSS = css
		.replace(/(\d+)ms/g, `${duration}ms`)
		.replace(/ease-in-out|cubic-bezier\([^)]+\)/g, easing);
	style.textContent = customCSS;
	document.head.appendChild(style);
	activeStyle = style;

	if (typeof document.startViewTransition !== "function") {
		const next = getCurrentTheme() === "light" ? "dark" : "light";
		setTheme(next);
		style.remove();
		activeStyle = null;
		return;
	}

	const next = getCurrentTheme() === "light" ? "dark" : "light";

	document
		.startViewTransition(() => {
			setTheme(next);
		})
		.finished.finally(() => {
			setTimeout(() => {
				style.remove();
				activeStyle = null;
			}, 50);
		});
}

export interface ThemeToggleSwitchOptions {
	transition?: string;
	css?: string;
	duration?: number;
	easing?: string;
}

export function createThemeToggleSwitch(
	options: ThemeToggleSwitchOptions = {},
): HTMLButtonElement {
	const { transition = "fade", css, duration, easing } = options;

	const button = document.createElement("button");
	button.type = "button";
	button.role = "switch";
	button.setAttribute("aria-label", "Toggle theme");
	Object.assign(button.style, {
		display: "inline-flex",
		alignItems: "center",
		width: "2.75rem",
		height: "1.5rem",
		flexShrink: "0",
		cursor: "pointer",
		borderRadius: "9999px",
		border: "2px solid transparent",
		transition: "background-color 0.15s",
		outline: "none",
	});

	const thumb = document.createElement("span");
	Object.assign(thumb.style, {
		pointerEvents: "none",
		display: "block",
		width: "1.25rem",
		height: "1.25rem",
		borderRadius: "9999px",
		backgroundColor: "var(--background)",
		boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
		transition: "transform 0.15s",
	});
	button.appendChild(thumb);

	const srOnly = document.createElement("span");
	srOnly.className = "sr-only";
	srOnly.textContent = "Toggle theme";
	button.appendChild(srOnly);

	function updateSwitch() {
		const isDark = getCurrentTheme() === "dark";
		button.setAttribute("aria-checked", String(isDark));
		button.style.backgroundColor = isDark
			? "var(--foreground)"
			: "var(--muted)";
		thumb.style.transform = isDark
			? "translateX(1.25rem)"
			: "translateX(0)";
	}

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
		updateSwitch();
	}

	button.addEventListener("click", toggleTheme);

	const observer = new MutationObserver(() => updateSwitch());
	observer.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ["class"],
	});

	updateSwitch();

	return button;
}

export { getCurrentTheme, setTheme, triggerLiveTransition, TRANSITION_CSS };
// --- end inlined ---

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
