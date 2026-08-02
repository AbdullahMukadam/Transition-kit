export interface TransitionTemplate {
	slug: string;
	name: string;
	description: string;
	category: "simple" | "mask" | "3d" | "composite";
	type: "theme" | "page";
	css: string;
	js: string;
	frameworks: {
		vanilla: string;
		react: string;
		nextjs: string;
		vue: string;
		svelte: string;
	};
	config: {
		duration: number;
		easing: string;
		direction?: string;
		directionOptions?: { label: string; value: string }[];
	};
	previewColors: {
		from: string;
		to: string;
	};
	video?: string;
	featured?: boolean;
	isNew?: boolean;
}

const VANILLA_SNIPPET = `function switchTheme() {
  const el = document.documentElement;
  el.classList.toggle("dark");
  localStorage.setItem("theme", el.classList.contains("dark") ? "dark" : "light");
}

// Wrap the DOM update in startViewTransition
document.getElementById("theme-btn").addEventListener("click", () => {
  if (!document.startViewTransition) {
    switchTheme();
    return;
  }
  document.startViewTransition(() => switchTheme());
});`;

const REACT_SNIPPET = `import { useTransition } from "react";

function switchTheme() {
  const el = document.documentElement;
  el.classList.toggle("dark");
  localStorage.setItem("theme", el.classList.contains("dark") ? "dark" : "light");
}

function ThemeButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button onClick={() => {
      startTransition(() => switchTheme());
    }}>
      Toggle Theme
    </button>
  );
}`;

const NEXTJS_SNIPPET = `"use client";
import { useRouter } from "next/navigation";

function switchTheme() {
  const el = document.documentElement;
  el.classList.toggle("dark");
  localStorage.setItem("theme", el.classList.contains("dark") ? "dark" : "light");
}

function ThemeButton() {
  const router = useRouter();

  const handleClick = () => {
    if (!document.startViewTransition) {
      switchTheme();
      return;
    }
    document.startViewTransition(() => {
      switchTheme();
      router.refresh();
    });
  };

  return <button onClick={handleClick}>Toggle</button>;
}`;

const VUE_SNIPPET = `<script setup>
function switchTheme() {
  const el = document.documentElement;
  el.classList.toggle("dark");
  localStorage.setItem("theme", el.classList.contains("dark") ? "dark" : "light");
}

function toggleTheme() {
  if (!document.startViewTransition) {
    switchTheme();
    return;
  }
  document.startViewTransition(() => switchTheme());
}
</script>

<template>
  <button @click="toggleTheme">Toggle Theme</button>
</template>`;

const SVELTE_SNIPPET = `<script>
  function switchTheme() {
    const el = document.documentElement;
    el.classList.toggle("dark");
    localStorage.setItem("theme", el.classList.contains("dark") ? "dark" : "light");
  }

  function toggleTheme() {
    if (!document.startViewTransition) {
      switchTheme();
      return;
    }
    document.startViewTransition(() => switchTheme());
  }
</script>

<button onclick={toggleTheme}>Toggle Theme</button>`;

const PAGE_VANILLA_SNIPPET = `document.getElementById("nav-btn").addEventListener("click", () => {
  if (!document.startViewTransition) {
    window.location.href = "/new-page";
    return;
  }
  document.startViewTransition(() => {
    window.location.href = "/new-page";
  });
});`;

const PAGE_REACT_SNIPPET = `import { useTransition } from "react";
import { useNavigate } from "react-router-dom";

function NavigationButton() {
  const [isPending, startTransition] = useTransition();
  const navigate = useNavigate();

  return (
    <button onClick={() => {
      startTransition(() => navigate("/new-page"));
    }}>
      Go to Page
    </button>
  );
}`;

const PAGE_NEXTJS_SNIPPET = `"use client";
import { useRouter } from "next/navigation";

function NavigationButton() {
  const router = useRouter();

  const handleClick = () => {
    if (!document.startViewTransition) {
      router.push("/new-page");
      return;
    }
    document.startViewTransition(() => {
      router.push("/new-page");
    });
  };

  return <button onClick={handleClick}>Go to Page</button>;
}`;

const PAGE_VUE_SNIPPET = `<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

function navigateToPage() {
  if (!document.startViewTransition) {
    router.push("/new-page");
    return;
  }
  document.startViewTransition(() => {
    router.push("/new-page");
  });
}
</script>

<template>
  <button @click="navigateToPage">Go to Page</button>
</template>`;

const PAGE_SVELTE_SNIPPET = `<script>
  import { goto } from "$app/navigation";

  function navigateToPage() {
    if (!document.startViewTransition) {
      goto("/new-page");
      return;
    }
    document.startViewTransition(() => {
      goto("/new-page");
    });
  }
</script>

<button on:click={navigateToPage}>Go to Page</button>`;

export const transitions: TransitionTemplate[] = [
	{
		slug: "circle-reveal",
		name: "Circle Reveal",
		description:
			"Expanding circular mask reveals the new theme from the center.",
		category: "mask",
		type: "theme",
		css: `::view-transition-old(root),
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
}`,
		js: `function switchTheme() {
  const el = document.documentElement;
  el.classList.toggle("dark");
  localStorage.setItem("theme", el.classList.contains("dark") ? "dark" : "light");
}

if (!document.startViewTransition) switchTheme();
document.startViewTransition(() => switchTheme());`,
		frameworks: {
			vanilla: VANILLA_SNIPPET,
			react: REACT_SNIPPET,
			nextjs: NEXTJS_SNIPPET,
			vue: VUE_SNIPPET,
			svelte: SVELTE_SNIPPET,
		},
		config: {
			duration: 1000,
			easing: "ease-in-out",
		},
		previewColors: {
			from: "#ededed",
			to: "#171717",
		},
		video: "/demos/theme-toggles/circle-reveal.mp4",
		featured: true,
	},
	{
		slug: "circle-blur",
		name: "Circle Blur",
		description:
			"Circular mask with gaussian blur for a soft, diffused reveal. Use direction controls to change origin.",
		category: "mask",
		type: "theme",
		css: `::view-transition-group(root) {
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
}`,
		js: `function switchTheme() {
  const el = document.documentElement;
  el.classList.toggle("dark");
  localStorage.setItem("theme", el.classList.contains("dark") ? "dark" : "light");
}

if (!document.startViewTransition) switchTheme();
document.startViewTransition(() => switchTheme());`,
		frameworks: {
			vanilla: VANILLA_SNIPPET,
			react: REACT_SNIPPET,
			nextjs: NEXTJS_SNIPPET,
			vue: VUE_SNIPPET,
			svelte: SVELTE_SNIPPET,
		},
		config: {
			duration: 1000,
			easing: "cubic-bezier(0.16, 1, 0.3, 1)",
			direction: "center",
			directionOptions: [
				{ label: "Center", value: "center" },
				{ label: "Top Left", value: "top-left" },
				{ label: "Top Right", value: "top-right" },
				{ label: "Bottom Left", value: "bottom-left" },
				{ label: "Bottom Right", value: "bottom-right" },
			],
		},
		previewColors: {
			from: "#ededed",
			to: "#0a0a0a",
		},
		video: "/demos/theme-toggles/circle-blur.mp4",
		featured: true,
	},
	{
		slug: "polygon-reveal",
		name: "Polygon Reveal",
		description:
			"Clip-path polygon animates a geometric wipe to reveal the new theme.",
		category: "mask",
		type: "theme",
		css: `::view-transition-group(root) {
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
}`,
		js: `function switchTheme() {
  const el = document.documentElement;
  el.classList.toggle("dark");
  localStorage.setItem("theme", el.classList.contains("dark") ? "dark" : "light");
}

if (!document.startViewTransition) switchTheme();
document.startViewTransition(() => switchTheme());`,
		frameworks: {
			vanilla: VANILLA_SNIPPET,
			react: REACT_SNIPPET,
			nextjs: NEXTJS_SNIPPET,
			vue: VUE_SNIPPET,
			svelte: SVELTE_SNIPPET,
		},
		config: {
			duration: 700,
			easing: "cubic-bezier(0.16, 1, 0.3, 1)",
		},
		previewColors: {
			from: "#ededed",
			to: "#171717",
		},
		video: "/demos/theme-toggles/polygon-reveal.mp4",
		featured: true,
	},
	{
		slug: "gif-frog",
		name: "GIF Frog",
		description:
			"A cute dancing frog reveals the new theme through an expanding mask.",
		category: "mask",
		type: "theme",
		css: `::view-transition-group(root) {
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
}`,
		js: `function switchTheme() {
  const el = document.documentElement;
  el.classList.toggle("dark");
  localStorage.setItem("theme", el.classList.contains("dark") ? "dark" : "light");
}

if (!document.startViewTransition) switchTheme();
document.startViewTransition(() => switchTheme());`,
		frameworks: {
			vanilla: VANILLA_SNIPPET,
			react: REACT_SNIPPET,
			nextjs: NEXTJS_SNIPPET,
			vue: VUE_SNIPPET,
			svelte: SVELTE_SNIPPET,
		},
		config: {
			duration: 1500,
			easing: "cubic-bezier(0.16, 1, 0.3, 1)",
		},
		previewColors: {
			from: "#ededed",
			to: "#171717",
		},
		video: "/demos/theme-toggles/gif-frog.mp4",
		isNew: true,
	},
	{
		slug: "gif-penguin",
		name: "GIF Penguin",
		description: "A happy dancing penguin masks the theme transition.",
		category: "mask",
		type: "theme",
		css: `::view-transition-group(root) {
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}

::view-transition-old(root),
.dark::view-transition-old(root) {
  animation: none;
  animation-fill-mode: both;
  z-index: -1;
}

::view-transition-new(root) {
  mask: url('https://media.tenor.com/tGCwmrNRc9wAAAAi/dance-dancer.gif')
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
}`,
		js: `function switchTheme() {
  const el = document.documentElement;
  el.classList.toggle("dark");
  localStorage.setItem("theme", el.classList.contains("dark") ? "dark" : "light");
}

if (!document.startViewTransition) switchTheme();
document.startViewTransition(() => switchTheme());`,
		frameworks: {
			vanilla: VANILLA_SNIPPET,
			react: REACT_SNIPPET,
			nextjs: NEXTJS_SNIPPET,
			vue: VUE_SNIPPET,
			svelte: SVELTE_SNIPPET,
		},
		config: {
			duration: 1500,
			easing: "cubic-bezier(0.16, 1, 0.3, 1)",
		},
		previewColors: {
			from: "#ededed",
			to: "#171717",
		},
		video: "/demos/theme-toggles/gif-penguin.mp4",
		isNew: true,
	},
	{
		slug: "gif-cat",
		name: "GIF Cat",
		description: "A dancing orange cat animates the theme reveal.",
		category: "mask",
		type: "theme",
		css: `::view-transition-group(root) {
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}

::view-transition-old(root),
.dark::view-transition-old(root) {
  animation: none;
  animation-fill-mode: both;
  z-index: -1;
}

::view-transition-new(root) {
  mask: url('https://media.tenor.com/GQAsycjoZG8AAAAi/scuba-scuba-cat.gif')
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
}`,
		js: `function switchTheme() {
  const el = document.documentElement;
  el.classList.toggle("dark");
  localStorage.setItem("theme", el.classList.contains("dark") ? "dark" : "light");
}

if (!document.startViewTransition) switchTheme();
document.startViewTransition(() => switchTheme());`,
		frameworks: {
			vanilla: VANILLA_SNIPPET,
			react: REACT_SNIPPET,
			nextjs: NEXTJS_SNIPPET,
			vue: VUE_SNIPPET,
			svelte: SVELTE_SNIPPET,
		},
		config: {
			duration: 1500,
			easing: "cubic-bezier(0.16, 1, 0.3, 1)",
		},
		previewColors: {
			from: "#ededed",
			to: "#171717",
		},
		video: "/demos/theme-toggles/gif-cat.mp4",
		isNew: true,
	},
	{
		slug: "fade",
		name: "Fade",
		description: "Smooth opacity crossfade between old and new page content.",
		category: "simple",
		type: "page",
		css: `::view-transition-old(root) {
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
}`,
		js: `function navigateTo(url) {
  if (!document.startViewTransition) {
    window.location.href = url;
    return;
  }
  document.startViewTransition(() => {
    window.location.href = url;
  });
}`,
		frameworks: {
			vanilla: PAGE_VANILLA_SNIPPET,
			react: PAGE_REACT_SNIPPET,
			nextjs: PAGE_NEXTJS_SNIPPET,
			vue: PAGE_VUE_SNIPPET,
			svelte: PAGE_SVELTE_SNIPPET,
		},
		config: {
			duration: 300,
			easing: "ease-in-out",
		},
		previewColors: {
			from: "#f2f2f2",
			to: "#171717",
		},
		video: "/demos/page-transitions/fade.mp4",
		featured: true,
	},
	{
		slug: "slide",
		name: "Slide",
		description:
			"Old page slides out, new page slides in. Use direction controls to change which way.",
		category: "simple",
		type: "page",
		css: `::view-transition-old(root) {
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
}`,
		js: `function navigateTo(url) {
  if (!document.startViewTransition) {
    window.location.href = url;
    return;
  }
  document.startViewTransition(() => {
    window.location.href = url;
  });
}`,
		frameworks: {
			vanilla: PAGE_VANILLA_SNIPPET,
			react: PAGE_REACT_SNIPPET,
			nextjs: PAGE_NEXTJS_SNIPPET,
			vue: PAGE_VUE_SNIPPET,
			svelte: PAGE_SVELTE_SNIPPET,
		},
		config: {
			duration: 400,
			easing: "cubic-bezier(0.4, 0, 0.2, 1)",
			direction: "left",
			directionOptions: [
				{ label: "Left", value: "left" },
				{ label: "Right", value: "right" },
				{ label: "Up", value: "up" },
				{ label: "Down", value: "down" },
			],
		},
		previewColors: {
			from: "#f2f2f2",
			to: "#171717",
		},
		video: "/demos/page-transitions/slide.mp4",
	},
	{
		slug: "scale",
		name: "Scale",
		description: "New page scales up from center while old page fades out.",
		category: "simple",
		type: "page",
		css: `::view-transition-old(root) {
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
}`,
		js: `function navigateTo(url) {
  if (!document.startViewTransition) {
    window.location.href = url;
    return;
  }
  document.startViewTransition(() => {
    window.location.href = url;
  });
}`,
		frameworks: {
			vanilla: PAGE_VANILLA_SNIPPET,
			react: PAGE_REACT_SNIPPET,
			nextjs: PAGE_NEXTJS_SNIPPET,
			vue: PAGE_VUE_SNIPPET,
			svelte: PAGE_SVELTE_SNIPPET,
		},
		config: {
			duration: 500,
			easing: "cubic-bezier(0.16, 1, 0.3, 1)",
		},
		previewColors: {
			from: "#f2f2f2",
			to: "#171717",
		},
		video: "/demos/page-transitions/scale.mp4",
		featured: true,
	},
	{
		slug: "flip",
		name: "Flip",
		description: "3D card flip on the Y-axis to reveal the new page.",
		category: "3d",
		type: "page",
		css: `::view-transition-old(root) {
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
}`,
		js: `function navigateTo(url) {
  if (!document.startViewTransition) {
    window.location.href = url;
    return;
  }
  document.startViewTransition(() => {
    window.location.href = url;
  });
}`,
		frameworks: {
			vanilla: PAGE_VANILLA_SNIPPET,
			react: PAGE_REACT_SNIPPET,
			nextjs: PAGE_NEXTJS_SNIPPET,
			vue: PAGE_VUE_SNIPPET,
			svelte: PAGE_SVELTE_SNIPPET,
		},
		config: {
			duration: 600,
			easing: "ease-in-out",
		},
		previewColors: {
			from: "#f2f2f2",
			to: "#171717",
		},
		video: "/demos/page-transitions/flip.mp4",
	},
	{
		slug: "blur",
		name: "Blur",
		description: "Old page blurs and fades while new page sharpens in.",
		category: "composite",
		type: "page",
		css: `::view-transition-old(root) {
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
}`,
		js: `function navigateTo(url) {
  if (!document.startViewTransition) {
    window.location.href = url;
    return;
  }
  document.startViewTransition(() => {
    window.location.href = url;
  });
}`,
		frameworks: {
			vanilla: PAGE_VANILLA_SNIPPET,
			react: PAGE_REACT_SNIPPET,
			nextjs: PAGE_NEXTJS_SNIPPET,
			vue: PAGE_VUE_SNIPPET,
			svelte: PAGE_SVELTE_SNIPPET,
		},
		config: {
			duration: 500,
			easing: "ease-in-out",
		},
		previewColors: {
			from: "#f2f2f2",
			to: "#171717",
		},
		video: "/demos/page-transitions/blur.mp4",
	},
	{
		slug: "rotate",
		name: "Rotate",
		description:
			"New page rotates in from the center while old page fades out.",
		category: "simple",
		type: "page",
		css: `::view-transition-old(root) {
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
}`,
		js: `function navigateTo(url) {
  if (!document.startViewTransition) {
    window.location.href = url;
    return;
  }
  document.startViewTransition(() => {
    window.location.href = url;
  });
}`,
		frameworks: {
			vanilla: PAGE_VANILLA_SNIPPET,
			react: PAGE_REACT_SNIPPET,
			nextjs: PAGE_NEXTJS_SNIPPET,
			vue: PAGE_VUE_SNIPPET,
			svelte: PAGE_SVELTE_SNIPPET,
		},
		config: {
			duration: 500,
			easing: "cubic-bezier(0.4, 0, 0.2, 1)",
		},
		previewColors: {
			from: "#f2f2f2",
			to: "#171717",
		},
		video: "/demos/page-transitions/rotate.mp4",
		isNew: true,
	},
	{
		slug: "zoom",
		name: "Zoom",
		description: "Old page zooms out and fades, new page zooms in from center.",
		category: "simple",
		type: "page",
		css: `::view-transition-old(root) {
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
}`,
		js: `function navigateTo(url) {
  if (!document.startViewTransition) {
    window.location.href = url;
    return;
  }
  document.startViewTransition(() => {
    window.location.href = url;
  });
}`,
		frameworks: {
			vanilla: PAGE_VANILLA_SNIPPET,
			react: PAGE_REACT_SNIPPET,
			nextjs: PAGE_NEXTJS_SNIPPET,
			vue: PAGE_VUE_SNIPPET,
			svelte: PAGE_SVELTE_SNIPPET,
		},
		config: {
			duration: 400,
			easing: "cubic-bezier(0.4, 0, 0.2, 1)",
		},
		previewColors: {
			from: "#f2f2f2",
			to: "#171717",
		},
		video: "/demos/page-transitions/zoom.mp4",
		isNew: true,
	},

	// ─────────────────────────────────────────────
	// NEW: theme transitions
	// ─────────────────────────────────────────────
	{
		slug: "star-reveal",
		name: "Star Reveal",
		description:
			"Expanding star-shaped mask reveals the new theme from the center.",
		category: "mask",
		type: "theme",
		css: `::view-transition-old(root),
.dark::view-transition-old(root) {
  animation: none;
  animation-fill-mode: both;
  z-index: -1;
}

::view-transition-new(root) {
  mask: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><polygon points="20,2 24.5,15 38,15 27,23 31,36 20,28 9,36 13,23 2,15 15.5,15" fill="white"/></svg>')
    center / 0 no-repeat;
  animation: star-reveal 1s both;
}

.dark::view-transition-new(root) {
  animation: star-reveal 1s both;
}

@keyframes star-reveal {
  to {
    mask-size: 200vmax;
  }
}`,
		js: `function switchTheme() {
  const el = document.documentElement;
  el.classList.toggle("dark");
  localStorage.setItem("theme", el.classList.contains("dark") ? "dark" : "light");
}

if (!document.startViewTransition) switchTheme();
document.startViewTransition(() => switchTheme());`,
		frameworks: {
			vanilla: VANILLA_SNIPPET,
			react: REACT_SNIPPET,
			nextjs: NEXTJS_SNIPPET,
			vue: VUE_SNIPPET,
			svelte: SVELTE_SNIPPET,
		},
		config: {
			duration: 1000,
			easing: "ease-in-out",
		},
		previewColors: {
			from: "#ededed",
			to: "#171717",
		},
		video: "/demos/theme-toggles/star-reveal.mp4",
		isNew: true,
	},
	{
		slug: "heart-reveal",
		name: "Heart Reveal",
		description:
			"Expanding heart-shaped mask reveals the new theme from the center.",
		category: "mask",
		type: "theme",
		css: `::view-transition-old(root),
.dark::view-transition-old(root) {
  animation: none;
  animation-fill-mode: both;
  z-index: -1;
}

::view-transition-new(root) {
  mask: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><path d="M20 34 C10 26 2 19 2 12 C2 6 7 2 12 2 C16 2 19 4 20 8 C21 4 24 2 28 2 C33 2 38 6 38 12 C38 19 30 26 20 34 Z" fill="white"/></svg>')
    center / 0 no-repeat;
  animation: heart-reveal 1.2s both;
}

.dark::view-transition-new(root) {
  animation: heart-reveal 1.2s both;
}

@keyframes heart-reveal {
  to {
    mask-size: 200vmax;
  }
}`,
		js: `function switchTheme() {
  const el = document.documentElement;
  el.classList.toggle("dark");
  localStorage.setItem("theme", el.classList.contains("dark") ? "dark" : "light");
}

if (!document.startViewTransition) switchTheme();
document.startViewTransition(() => switchTheme());`,
		frameworks: {
			vanilla: VANILLA_SNIPPET,
			react: REACT_SNIPPET,
			nextjs: NEXTJS_SNIPPET,
			vue: VUE_SNIPPET,
			svelte: SVELTE_SNIPPET,
		},
		config: {
			duration: 1200,
			easing: "ease-in-out",
		},
		previewColors: {
			from: "#fdf2f8",
			to: "#171717",
		},
		video: "/demos/theme-toggles/heart-reveal.mp4",
		isNew: true,
	},
	{
		slug: "diagonal-wipe",
		name: "Diagonal Wipe",
		description:
			"A diagonal clip-path band sweeps across the screen to reveal the new theme.",
		category: "composite",
		type: "theme",
		css: `::view-transition-group(root) {
  animation-duration: 600ms;
  animation-timing-function: cubic-bezier(0.65, 0, 0.35, 1);
}

::view-transition-old(root),
.dark::view-transition-old(root) {
  animation: none;
  animation-fill-mode: both;
  z-index: -1;
}

::view-transition-new(root) {
  animation-name: diagonal-wipe-light;
  animation-fill-mode: both;
}

.dark::view-transition-new(root) {
  animation-name: diagonal-wipe-dark;
  animation-fill-mode: both;
}

@keyframes diagonal-wipe-dark {
  from {
    clip-path: polygon(-20% 0, 0% 0, -20% 120%, -40% 120%);
  }
  to {
    clip-path: polygon(-20% 0, 120% 0, 100% 120%, -40% 120%);
  }
}

@keyframes diagonal-wipe-light {
  from {
    clip-path: polygon(120% 0, 140% 0, 120% 120%, 100% 120%);
  }
  to {
    clip-path: polygon(120% 0, -20% 0, -40% 120%, 100% 120%);
  }
}`,
		js: `function switchTheme() {
  const el = document.documentElement;
  el.classList.toggle("dark");
  localStorage.setItem("theme", el.classList.contains("dark") ? "dark" : "light");
}

if (!document.startViewTransition) switchTheme();
document.startViewTransition(() => switchTheme());`,
		frameworks: {
			vanilla: VANILLA_SNIPPET,
			react: REACT_SNIPPET,
			nextjs: NEXTJS_SNIPPET,
			vue: VUE_SNIPPET,
			svelte: SVELTE_SNIPPET,
		},
		config: {
			duration: 600,
			easing: "cubic-bezier(0.65, 0, 0.35, 1)",
		},
		previewColors: {
			from: "#ededed",
			to: "#171717",
		},
		video: "/demos/theme-toggles/diagonal-wipe.mp4",
		isNew: true,
	},
	{
		slug: "checkerboard-reveal",
		name: "Checkerboard Reveal",
		description:
			"A checkerboard-patterned mask expands to reveal the new theme in tiles.",
		category: "mask",
		type: "theme",
		css: `::view-transition-old(root),
.dark::view-transition-old(root) {
  animation: none;
  animation-fill-mode: both;
  z-index: -1;
}

::view-transition-new(root) {
  mask: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="10" height="10" fill="white"/><rect x="10" y="10" width="10" height="10" fill="white"/><rect x="20" width="10" height="10" fill="white"/><rect x="20" y="20" width="10" height="10" fill="white"/><rect x="30" y="10" width="10" height="10" fill="white"/><rect x="30" y="30" width="10" height="10" fill="white"/><rect y="20" width="10" height="10" fill="white"/><rect x="10" y="30" width="10" height="10" fill="white"/></svg>')
    center / 0 no-repeat;
  animation: checkerboard-reveal 1s both;
}

.dark::view-transition-new(root) {
  animation: checkerboard-reveal 1s both;
}

@keyframes checkerboard-reveal {
  to {
    mask-size: 200vmax;
  }
}`,
		js: `function switchTheme() {
  const el = document.documentElement;
  el.classList.toggle("dark");
  localStorage.setItem("theme", el.classList.contains("dark") ? "dark" : "light");
}

if (!document.startViewTransition) switchTheme();
document.startViewTransition(() => switchTheme());`,
		frameworks: {
			vanilla: VANILLA_SNIPPET,
			react: REACT_SNIPPET,
			nextjs: NEXTJS_SNIPPET,
			vue: VUE_SNIPPET,
			svelte: SVELTE_SNIPPET,
		},
		config: {
			duration: 1000,
			easing: "ease-in-out",
		},
		previewColors: {
			from: "#ededed",
			to: "#171717",
		},
		video: "/demos/theme-toggles/checkerboard-reveal.mp4",
		isNew: true,
	},
	{
		slug: "ripple-reveal",
		name: "Ripple Reveal",
		description:
			"Concentric ring mask ripples outward from the click point to reveal the theme.",
		category: "mask",
		type: "theme",
		css: `::view-transition-old(root),
.dark::view-transition-old(root) {
  animation: none;
  animation-fill-mode: both;
  z-index: -1;
}

::view-transition-new(root) {
  mask: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="none" stroke="white" stroke-width="4"/><circle cx="20" cy="20" r="10" fill="none" stroke="white" stroke-width="4"/><circle cx="20" cy="20" r="2" fill="white"/></svg>')
    center / 0 no-repeat;
  animation: ripple-reveal 1.1s both;
}

.dark::view-transition-new(root) {
  animation: ripple-reveal 1.1s both;
}

@keyframes ripple-reveal {
  to {
    mask-size: 220vmax;
  }
}`,
		js: `function switchTheme() {
  const el = document.documentElement;
  el.classList.toggle("dark");
  localStorage.setItem("theme", el.classList.contains("dark") ? "dark" : "light");
}

if (!document.startViewTransition) switchTheme();
document.startViewTransition(() => switchTheme());`,
		frameworks: {
			vanilla: VANILLA_SNIPPET,
			react: REACT_SNIPPET,
			nextjs: NEXTJS_SNIPPET,
			vue: VUE_SNIPPET,
			svelte: SVELTE_SNIPPET,
		},
		config: {
			duration: 1100,
			easing: "ease-in-out",
		},
		previewColors: {
			from: "#ededed",
			to: "#171717",
		},
		video: "/demos/theme-toggles/ripple-reveal.mp4",
		isNew: true,
	},
	{
		slug: "venetian-blinds-theme",
		name: "Venetian Blinds",
		description:
			"Horizontal slats clip open one by one, like blinds, to reveal the new theme.",
		category: "composite",
		type: "theme",
		css: `::view-transition-group(root) {
  animation-duration: 700ms;
  animation-timing-function: ease-in-out;
}

::view-transition-old(root),
.dark::view-transition-old(root) {
  animation: none;
  animation-fill-mode: both;
  z-index: -1;
}

::view-transition-new(root) {
  animation-name: blinds-reveal;
  animation-fill-mode: both;
}

.dark::view-transition-new(root) {
  animation-name: blinds-reveal;
}

@keyframes blinds-reveal {
  from {
    clip-path: polygon(
      0 0%, 100% 0%, 100% 2%, 0 2%,
      0 12%, 100% 12%, 100% 14%, 0 14%,
      0 24%, 100% 24%, 100% 26%, 0 26%,
      0 36%, 100% 36%, 100% 38%, 0 38%,
      0 48%, 100% 48%, 100% 50%, 0 50%,
      0 60%, 100% 60%, 100% 62%, 0 62%,
      0 72%, 100% 72%, 100% 74%, 0 74%,
      0 84%, 100% 84%, 100% 86%, 0 86%,
      0 96%, 100% 96%, 100% 98%, 0 98%
    );
  }
  to {
    clip-path: polygon(
      0 0%, 100% 0%, 100% 10%, 0 10%,
      0 10%, 100% 10%, 100% 22%, 0 22%,
      0 22%, 100% 22%, 100% 34%, 0 34%,
      0 34%, 100% 34%, 100% 46%, 0 46%,
      0 46%, 100% 46%, 100% 58%, 0 58%,
      0 58%, 100% 58%, 100% 70%, 0 70%,
      0 70%, 100% 70%, 100% 82%, 0 82%,
      0 82%, 100% 82%, 100% 94%, 0 94%,
      0 94%, 100% 94%, 100% 100%, 0 100%
    );
  }
}`,
		js: `function switchTheme() {
  const el = document.documentElement;
  el.classList.toggle("dark");
  localStorage.setItem("theme", el.classList.contains("dark") ? "dark" : "light");
}

if (!document.startViewTransition) switchTheme();
document.startViewTransition(() => switchTheme());`,
		frameworks: {
			vanilla: VANILLA_SNIPPET,
			react: REACT_SNIPPET,
			nextjs: NEXTJS_SNIPPET,
			vue: VUE_SNIPPET,
			svelte: SVELTE_SNIPPET,
		},
		config: {
			duration: 700,
			easing: "ease-in-out",
		},
		previewColors: {
			from: "#ededed",
			to: "#171717",
		},
		video: "/demos/theme-toggles/venetian-blinds-theme.mp4",
		isNew: true,
	},
	{
		slug: "spiral-reveal",
		name: "Spiral Reveal",
		description: "A spiral-shaped mask winds outward to reveal the new theme.",
		category: "mask",
		type: "theme",
		css: `::view-transition-old(root),
.dark::view-transition-old(root) {
  animation: none;
  animation-fill-mode: both;
  z-index: -1;
}

::view-transition-new(root) {
  mask: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><path d="M20 20 m0 -16 a16 16 0 1 1 -11.3 27.3 a11 11 0 1 1 7.8 -18.8 a6 6 0 1 1 -4.2 10.2" fill="none" stroke="white" stroke-width="4" stroke-linecap="round"/></svg>')
    center / 0 no-repeat;
  animation: spiral-reveal 1.3s both;
}

.dark::view-transition-new(root) {
  animation: spiral-reveal 1.3s both;
}

@keyframes spiral-reveal {
  to {
    mask-size: 220vmax;
  }
}`,
		js: `function switchTheme() {
  const el = document.documentElement;
  el.classList.toggle("dark");
  localStorage.setItem("theme", el.classList.contains("dark") ? "dark" : "light");
}

if (!document.startViewTransition) switchTheme();
document.startViewTransition(() => switchTheme());`,
		frameworks: {
			vanilla: VANILLA_SNIPPET,
			react: REACT_SNIPPET,
			nextjs: NEXTJS_SNIPPET,
			vue: VUE_SNIPPET,
			svelte: SVELTE_SNIPPET,
		},
		config: {
			duration: 1300,
			easing: "ease-in-out",
		},
		previewColors: {
			from: "#ededed",
			to: "#171717",
		},
		video: "/demos/theme-toggles/spiral-reveal.mp4",
		isNew: true,
	},
	{
		slug: "wave-reveal-theme",
		name: "Wave Reveal",
		description:
			"A wavy clip-path edge sweeps across the screen for an organic theme reveal.",
		category: "composite",
		type: "theme",
		css: `::view-transition-group(root) {
  animation-duration: 800ms;
  animation-timing-function: cubic-bezier(0.65, 0, 0.35, 1);
}

::view-transition-old(root),
.dark::view-transition-old(root) {
  animation: none;
  animation-fill-mode: both;
  z-index: -1;
}

::view-transition-new(root) {
  animation-name: wave-reveal;
  animation-fill-mode: both;
}

.dark::view-transition-new(root) {
  animation-name: wave-reveal;
}

@keyframes wave-reveal {
  from {
    clip-path: polygon(
      0% 0%, 5% 0%, 10% 0%, 15% 0%, 0% 0%
    );
  }
  to {
    clip-path: polygon(
      0% 0%, 100% 0%, 100% 100%, 0% 100%,
      0% 60%, 5% 55%, 10% 60%, 15% 55%,
      20% 60%, 25% 55%, 0% 0%
    );
  }
}`,
		js: `function switchTheme() {
  const el = document.documentElement;
  el.classList.toggle("dark");
  localStorage.setItem("theme", el.classList.contains("dark") ? "dark" : "light");
}

if (!document.startViewTransition) switchTheme();
document.startViewTransition(() => switchTheme());`,
		frameworks: {
			vanilla: VANILLA_SNIPPET,
			react: REACT_SNIPPET,
			nextjs: NEXTJS_SNIPPET,
			vue: VUE_SNIPPET,
			svelte: SVELTE_SNIPPET,
		},
		config: {
			duration: 800,
			easing: "cubic-bezier(0.65, 0, 0.35, 1)",
		},
		previewColors: {
			from: "#ededed",
			to: "#171717",
		},
		video: "/demos/theme-toggles/wave-reveal-theme.mp4",
		isNew: true,
	},

	// ─────────────────────────────────────────────
	// NEW: page transitions
	// ─────────────────────────────────────────────
	{
		slug: "curtain",
		name: "Curtain",
		description:
			"Old page splits and slides apart like curtains to reveal the new page.",
		category: "composite",
		type: "page",
		css: `::view-transition-old(root) {
  animation: curtain-out 600ms cubic-bezier(0.65, 0, 0.35, 1) both;
}

::view-transition-new(root) {
  animation: curtain-in 600ms cubic-bezier(0.65, 0, 0.35, 1) both;
}

@keyframes curtain-out {
  from {
    clip-path: inset(0 0 0 0);
    opacity: 1;
  }
  to {
    clip-path: inset(0 50% 0 50%);
    opacity: 0;
  }
}

@keyframes curtain-in {
  from {
    clip-path: inset(0 50% 0 50%);
  }
  to {
    clip-path: inset(0 0 0 0);
  }
}`,
		js: `function navigateTo(url) {
  if (!document.startViewTransition) {
    window.location.href = url;
    return;
  }
  document.startViewTransition(() => {
    window.location.href = url;
  });
}`,
		frameworks: {
			vanilla: PAGE_VANILLA_SNIPPET,
			react: PAGE_REACT_SNIPPET,
			nextjs: PAGE_NEXTJS_SNIPPET,
			vue: PAGE_VUE_SNIPPET,
			svelte: PAGE_SVELTE_SNIPPET,
		},
		config: {
			duration: 600,
			easing: "cubic-bezier(0.65, 0, 0.35, 1)",
		},
		previewColors: {
			from: "#f2f2f2",
			to: "#171717",
		},
		video: "/demos/page-transitions/curtain.mp4",
		isNew: true,
	},
	{
		slug: "cube",
		name: "Cube",
		description:
			"Pages rotate around a 3D cube axis, old page swinging away as the new one turns in.",
		category: "3d",
		type: "page",
		css: `::view-transition-old(root) {
  animation: cube-out 700ms ease-in-out both;
  transform-origin: right center;
}

::view-transition-new(root) {
  animation: cube-in 700ms ease-in-out both;
  transform-origin: left center;
}

@keyframes cube-out {
  from { transform: perspective(1500px) rotateY(0deg) translateZ(0); }
  to { transform: perspective(1500px) rotateY(-90deg) translateZ(-200px); }
}

@keyframes cube-in {
  from { transform: perspective(1500px) rotateY(90deg) translateZ(-200px); }
  to { transform: perspective(1500px) rotateY(0deg) translateZ(0); }
}`,
		js: `function navigateTo(url) {
  if (!document.startViewTransition) {
    window.location.href = url;
    return;
  }
  document.startViewTransition(() => {
    window.location.href = url;
  });
}`,
		frameworks: {
			vanilla: PAGE_VANILLA_SNIPPET,
			react: PAGE_REACT_SNIPPET,
			nextjs: PAGE_NEXTJS_SNIPPET,
			vue: PAGE_VUE_SNIPPET,
			svelte: PAGE_SVELTE_SNIPPET,
		},
		config: {
			duration: 700,
			easing: "ease-in-out",
		},
		previewColors: {
			from: "#f2f2f2",
			to: "#171717",
		},
		video: "/demos/page-transitions/cube.mp4",
		isNew: true,
	},
	{
		slug: "skew-slide",
		name: "Skew Slide",
		description:
			"Pages skew slightly as they slide past each other for a dynamic, energetic feel.",
		category: "3d",
		type: "page",
		css: `::view-transition-old(root) {
  animation: skew-slide-out 450ms cubic-bezier(0.4, 0, 0.2, 1) both;
}

::view-transition-new(root) {
  animation: skew-slide-in 450ms cubic-bezier(0.4, 0, 0.2, 1) both;
}

@keyframes skew-slide-out {
  from { transform: skewX(0deg) translateX(0); opacity: 1; }
  to { transform: skewX(-8deg) translateX(-100%); opacity: 0; }
}

@keyframes skew-slide-in {
  from { transform: skewX(8deg) translateX(100%); opacity: 0; }
  to { transform: skewX(0deg) translateX(0); opacity: 1; }
}`,
		js: `function navigateTo(url) {
  if (!document.startViewTransition) {
    window.location.href = url;
    return;
  }
  document.startViewTransition(() => {
    window.location.href = url;
  });
}`,
		frameworks: {
			vanilla: PAGE_VANILLA_SNIPPET,
			react: PAGE_REACT_SNIPPET,
			nextjs: PAGE_NEXTJS_SNIPPET,
			vue: PAGE_VUE_SNIPPET,
			svelte: PAGE_SVELTE_SNIPPET,
		},
		config: {
			duration: 450,
			easing: "cubic-bezier(0.4, 0, 0.2, 1)",
		},
		previewColors: {
			from: "#f2f2f2",
			to: "#171717",
		},
		video: "/demos/page-transitions/skew-slide.mp4",
		isNew: true,
	},
	{
		slug: "page-curl",
		name: "Page Curl",
		description:
			"The old page curls up from the bottom corner like a turning book page.",
		category: "3d",
		type: "page",
		css: `::view-transition-old(root) {
  animation: page-curl-out 650ms ease-in both;
  transform-origin: bottom right;
}

::view-transition-new(root) {
  animation: page-curl-in 650ms ease-out both;
}

@keyframes page-curl-out {
  from {
    transform: perspective(1400px) rotateX(0deg) rotateY(0deg);
    opacity: 1;
  }
  to {
    transform: perspective(1400px) rotateX(20deg) rotateY(-70deg);
    opacity: 0;
  }
}

@keyframes page-curl-in {
  from {
    transform: scale(0.96);
    opacity: 0.4;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}`,
		js: `function navigateTo(url) {
  if (!document.startViewTransition) {
    window.location.href = url;
    return;
  }
  document.startViewTransition(() => {
    window.location.href = url;
  });
}`,
		frameworks: {
			vanilla: PAGE_VANILLA_SNIPPET,
			react: PAGE_REACT_SNIPPET,
			nextjs: PAGE_NEXTJS_SNIPPET,
			vue: PAGE_VUE_SNIPPET,
			svelte: PAGE_SVELTE_SNIPPET,
		},
		config: {
			duration: 650,
			easing: "ease-in-out",
		},
		previewColors: {
			from: "#f2f2f2",
			to: "#171717",
		},
		video: "/demos/page-transitions/page-curl.mp4",
		isNew: true,
	},
	{
		slug: "accordion",
		name: "Accordion",
		description:
			"Old page folds shut in vertical pleats while the new page unfolds open.",
		category: "3d",
		type: "page",
		css: `::view-transition-old(root) {
  animation: accordion-out 550ms ease-in-out both;
  transform-origin: left center;
}

::view-transition-new(root) {
  animation: accordion-in 550ms ease-in-out both;
  transform-origin: left center;
}

@keyframes accordion-out {
  from { transform: scaleX(1); opacity: 1; }
  to { transform: scaleX(0); opacity: 0.4; }
}

@keyframes accordion-in {
  from { transform: scaleX(0); opacity: 0.4; }
  to { transform: scaleX(1); opacity: 1; }
}`,
		js: `function navigateTo(url) {
  if (!document.startViewTransition) {
    window.location.href = url;
    return;
  }
  document.startViewTransition(() => {
    window.location.href = url;
  });
}`,
		frameworks: {
			vanilla: PAGE_VANILLA_SNIPPET,
			react: PAGE_REACT_SNIPPET,
			nextjs: PAGE_NEXTJS_SNIPPET,
			vue: PAGE_VUE_SNIPPET,
			svelte: PAGE_SVELTE_SNIPPET,
		},
		config: {
			duration: 550,
			easing: "ease-in-out",
		},
		previewColors: {
			from: "#f2f2f2",
			to: "#171717",
		},
		video: "/demos/page-transitions/accordian.mp4",
		isNew: true,
	},
	{
		slug: "doorway",
		name: "Doorway",
		description:
			"Old page swings away like a door on a hinge, revealing the new page behind it.",
		category: "3d",
		type: "page",
		css: `::view-transition-old(root) {
  animation: doorway-out 600ms ease-in both;
  transform-origin: left center;
}

::view-transition-new(root) {
  animation: doorway-in 600ms ease-out both;
}

@keyframes doorway-out {
  from { transform: perspective(1200px) rotateY(0deg); opacity: 1; }
  to { transform: perspective(1200px) rotateY(-110deg); opacity: 0; }
}

@keyframes doorway-in {
  from { transform: scale(1.05); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}`,
		js: `function navigateTo(url) {
  if (!document.startViewTransition) {
    window.location.href = url;
    return;
  }
  document.startViewTransition(() => {
    window.location.href = url;
  });
}`,
		frameworks: {
			vanilla: PAGE_VANILLA_SNIPPET,
			react: PAGE_REACT_SNIPPET,
			nextjs: PAGE_NEXTJS_SNIPPET,
			vue: PAGE_VUE_SNIPPET,
			svelte: PAGE_SVELTE_SNIPPET,
		},
		config: {
			duration: 600,
			easing: "ease-in-out",
		},
		previewColors: {
			from: "#f2f2f2",
			to: "#171717",
		},
		video: "/demos/page-transitions/doorway.mp4",
		isNew: true,
	},
	{
		slug: "book-flip",
		name: "Book Flip",
		description:
			"New page flips over the old one like a page turning in a book, centered on the spine.",
		category: "3d",
		type: "page",
		css: `::view-transition-old(root) {
  animation: book-flip-out 700ms ease-in-out both;
  transform-origin: center center;
}

::view-transition-new(root) {
  animation: book-flip-in 700ms ease-in-out both;
  transform-origin: center center;
}

@keyframes book-flip-out {
  from { transform: perspective(1600px) rotateX(0deg); opacity: 1; }
  to { transform: perspective(1600px) rotateX(90deg); opacity: 0.3; }
}

@keyframes book-flip-in {
  from { transform: perspective(1600px) rotateX(-90deg); opacity: 0.3; }
  to { transform: perspective(1600px) rotateX(0deg); opacity: 1; }
}`,
		js: `function navigateTo(url) {
  if (!document.startViewTransition) {
    window.location.href = url;
    return;
  }
  document.startViewTransition(() => {
    window.location.href = url;
  });
}`,
		frameworks: {
			vanilla: PAGE_VANILLA_SNIPPET,
			react: PAGE_REACT_SNIPPET,
			nextjs: PAGE_NEXTJS_SNIPPET,
			vue: PAGE_VUE_SNIPPET,
			svelte: PAGE_SVELTE_SNIPPET,
		},
		config: {
			duration: 700,
			easing: "ease-in-out",
		},
		previewColors: {
			from: "#f2f2f2",
			to: "#171717",
		},
		video: "/demos/page-transitions/book-flip.mp4",
		isNew: true,
	},
	{
		slug: "roll",
		name: "Roll",
		description:
			"Old page rolls away like a scroll while the new page unrolls into place.",
		category: "composite",
		type: "page",
		css: `::view-transition-old(root) {
  animation: roll-out 550ms cubic-bezier(0.4, 0, 0.2, 1) both;
  transform-origin: top center;
}

::view-transition-new(root) {
  animation: roll-in 550ms cubic-bezier(0.4, 0, 0.2, 1) both;
  transform-origin: top center;
}

@keyframes roll-out {
  from { transform: scaleY(1) translateY(0); opacity: 1; }
  to { transform: scaleY(0) translateY(-20%); opacity: 0; }
}

@keyframes roll-in {
  from { transform: scaleY(0) translateY(-20%); opacity: 0; }
  to { transform: scaleY(1) translateY(0); opacity: 1; }
}`,
		js: `function navigateTo(url) {
  if (!document.startViewTransition) {
    window.location.href = url;
    return;
  }
  document.startViewTransition(() => {
    window.location.href = url;
  });
}`,
		frameworks: {
			vanilla: PAGE_VANILLA_SNIPPET,
			react: PAGE_REACT_SNIPPET,
			nextjs: PAGE_NEXTJS_SNIPPET,
			vue: PAGE_VUE_SNIPPET,
			svelte: PAGE_SVELTE_SNIPPET,
		},
		config: {
			duration: 550,
			easing: "cubic-bezier(0.4, 0, 0.2, 1)",
		},
		previewColors: {
			from: "#f2f2f2",
			to: "#171717",
		},
		video: "/demos/page-transitions/roll.mp4",
		isNew: true,
	},
	{
		slug: "fold",
		name: "Fold",
		description:
			"Old page folds inward along its vertical center as the new page emerges.",
		category: "3d",
		type: "page",
		css: `::view-transition-old(root) {
  animation: fold-out 600ms ease-in-out both;
  transform-origin: center center;
}

::view-transition-new(root) {
  animation: fold-in 600ms ease-in-out both;
}

@keyframes fold-out {
  from { transform: perspective(1200px) rotateY(0deg) scaleX(1); opacity: 1; }
  to { transform: perspective(1200px) rotateY(90deg) scaleX(0.3); opacity: 0; }
}

@keyframes fold-in {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}`,
		js: `function navigateTo(url) {
  if (!document.startViewTransition) {
    window.location.href = url;
    return;
  }
  document.startViewTransition(() => {
    window.location.href = url;
  });
}`,
		frameworks: {
			vanilla: PAGE_VANILLA_SNIPPET,
			react: PAGE_REACT_SNIPPET,
			nextjs: PAGE_NEXTJS_SNIPPET,
			vue: PAGE_VUE_SNIPPET,
			svelte: PAGE_SVELTE_SNIPPET,
		},
		config: {
			duration: 600,
			easing: "ease-in-out",
		},
		previewColors: {
			from: "#f2f2f2",
			to: "#171717",
		},
		video: "/demos/page-transitions/fold.mp4",
		isNew: true,
	},
	{
		slug: "glitch",
		name: "Glitch",
		description:
			"Old page breaks into offset RGB-split slices before the new page snaps into focus.",
		category: "composite",
		type: "page",
		css: `::view-transition-old(root) {
  animation: glitch-out 400ms steps(6, end) both;
}

::view-transition-new(root) {
  animation: glitch-in 400ms steps(6, end) both;
}

@keyframes glitch-out {
  0% { transform: translate(0, 0); opacity: 1; }
  20% { transform: translate(-6px, 2px); opacity: 0.9; }
  40% { transform: translate(6px, -2px); opacity: 0.7; }
  60% { transform: translate(-4px, 0); opacity: 0.5; }
  80% { transform: translate(4px, 2px); opacity: 0.2; }
  100% { transform: translate(0, 0); opacity: 0; }
}

@keyframes glitch-in {
  0% { transform: translate(4px, -2px); opacity: 0; }
  30% { transform: translate(-6px, 2px); opacity: 0.4; }
  60% { transform: translate(6px, 0); opacity: 0.8; }
  100% { transform: translate(0, 0); opacity: 1; }
}`,
		js: `function navigateTo(url) {
  if (!document.startViewTransition) {
    window.location.href = url;
    return;
  }
  document.startViewTransition(() => {
    window.location.href = url;
  });
}`,
		frameworks: {
			vanilla: PAGE_VANILLA_SNIPPET,
			react: PAGE_REACT_SNIPPET,
			nextjs: PAGE_NEXTJS_SNIPPET,
			vue: PAGE_VUE_SNIPPET,
			svelte: PAGE_SVELTE_SNIPPET,
		},
		config: {
			duration: 400,
			easing: "steps(6, end)",
		},
		previewColors: {
			from: "#f2f2f2",
			to: "#171717",
		},
		video: "/demos/page-transitions/glitch.mp4",
		isNew: true,
	},
	{
		slug: "iris-wipe-page",
		name: "Iris Wipe",
		description:
			"A circular iris closes over the old page then opens onto the new one, like an old film cut.",
		category: "mask",
		type: "page",
		css: `::view-transition-old(root) {
  animation: iris-close 350ms ease-in both;
}

::view-transition-new(root) {
  mask: radial-gradient(circle at center, white 0%, white 0%, transparent 0%);
  animation: iris-open 350ms 350ms ease-out both;
}

@keyframes iris-close {
  from { clip-path: circle(75% at center); }
  to { clip-path: circle(0% at center); }
}

@keyframes iris-open {
  from { mask: radial-gradient(circle at center, white 0%, white 0%, transparent 0%); }
  to { mask: radial-gradient(circle at center, white 100%, white 100%, transparent 100%); }
}`,
		js: `function navigateTo(url) {
  if (!document.startViewTransition) {
    window.location.href = url;
    return;
  }
  document.startViewTransition(() => {
    window.location.href = url;
  });
}`,
		frameworks: {
			vanilla: PAGE_VANILLA_SNIPPET,
			react: PAGE_REACT_SNIPPET,
			nextjs: PAGE_NEXTJS_SNIPPET,
			vue: PAGE_VUE_SNIPPET,
			svelte: PAGE_SVELTE_SNIPPET,
		},
		config: {
			duration: 700,
			easing: "ease-in-out",
		},
		previewColors: {
			from: "#f2f2f2",
			to: "#171717",
		},
		video: "/demos/page-transitions/iris-wipe.mp4",
		isNew: true,
	},
];

export const TRANSITION_CSS: Record<string, string> = Object.fromEntries(
	transitions.map((t) => [t.slug, t.css]),
);

export function getTransitionBySlug(
	slug: string,
): TransitionTemplate | undefined {
	return transitions.find((t) => t.slug === slug);
}

export const categories = [
	{ id: "all", label: "All" },
	{ id: "simple", label: "Simple" },
	{ id: "mask", label: "Mask" },
	{ id: "3d", label: "3D" },
	{ id: "composite", label: "Composite" },
] as const;

export type CategoryId = (typeof categories)[number]["id"];
