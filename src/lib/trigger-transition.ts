import { transitions } from "#/data/transitions";

let activeStyle: HTMLStyleElement | null = null;

export function getCurrentTheme(): "light" | "dark" {
	const el = document.documentElement;
	if (el.classList.contains("dark")) return "dark";
	if (el.classList.contains("light")) return "light";
	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

export function setTheme(theme: "light" | "dark") {
	const el = document.documentElement;
	el.classList.remove("light", "dark");
	el.classList.add(theme);
	el.style.colorScheme = theme;
	window.localStorage.setItem("theme", theme);
	document.cookie = `_preferred-theme=${theme}; path=/; max-age=31536000`;
}

export function getTransitionBySlug(slug: string) {
	return transitions.find((t) => t.slug === slug);
}

function getKeyframeOverrides(css: string, direction: string): string {
	if (direction === "center") return "";

	const keyframeNames = [...css.matchAll(/@keyframes\s+([\w-]+)/g)].map(
		(m) => m[1],
	);

	if (keyframeNames.length === 0) return "";

	const isX = direction === "left" || direction === "right";
	const outSign = direction === "left" || direction === "up" ? "-" : "";
	const inSign = outSign === "-" ? "" : "-";

	let overrides = "";

	for (const name of keyframeNames) {
		const isOut = name.includes("out");
		const isIn = name.includes("in");
		if (!isOut && !isIn) continue;

		if (isX) {
			const translate = isOut
				? `translateX(${outSign}100%)`
				: `translateX(${inSign}100%)`;
			overrides += `@keyframes ${name} { from { transform: ${isOut ? "translateX(0)" : translate}; } to { transform: ${isOut ? translate : "translateX(0)"}; } }\n`;
		} else {
			const translate = isOut
				? `translateY(${outSign}100%)`
				: `translateY(${inSign}100%)`;
			overrides += `@keyframes ${name} { from { transform: ${isOut ? "translateY(0)" : translate}; } to { transform: ${isOut ? translate : "translateY(0)"}; } }\n`;
		}
	}

	return overrides;
}

function getMaskPositionOverrides(css: string, direction: string): string {
	if (!css.includes("mask:") && !css.includes("mask-position:")) return "";
	if (direction === "center") return "";

	const svgBase = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs><filter id="blur"><feGaussianBlur stdDeviation="2"/></filter></defs><circle cx="__CX__" cy="__CY__" r="18" fill="white" filter="url(%23blur"/></svg>`;

	const dirs: Record<
		string,
		{
			cx: string;
			cy: string;
			pos: string;
			origin?: string;
			transformOrigin?: string;
		}
	> = {
		left: { cx: "0", cy: "20", pos: "left center" },
		right: { cx: "40", cy: "20", pos: "right center" },
		up: { cx: "20", cy: "0", pos: "center top" },
		down: { cx: "20", cy: "40", pos: "center bottom" },
		"top-left": {
			cx: "0",
			cy: "0",
			pos: "top left",
			origin: "content-box",
			transformOrigin: "top left",
		},
		"top-right": {
			cx: "40",
			cy: "0",
			pos: "top right",
			origin: "content-box",
			transformOrigin: "top right",
		},
		"bottom-left": {
			cx: "0",
			cy: "40",
			pos: "bottom left",
			origin: "content-box",
			transformOrigin: "bottom left",
		},
		"bottom-right": {
			cx: "40",
			cy: "40",
			pos: "bottom right",
			origin: "content-box",
			transformOrigin: "bottom right",
		},
	};

	const d = dirs[direction];
	if (!d) return "";

	const svg = svgBase.replace("__CX__", d.cx).replace("__CY__", d.cy);
	const isCorner = !!d.origin;

	let overrides = `::view-transition-new(root),
.dark::view-transition-new(root) {
  mask-image: url('${svg}') !important;
  mask-position: ${d.pos} !important;
  mask-repeat: no-repeat !important;`;
	if (d.origin) overrides += `\n  mask-origin: ${d.origin} !important;`;
	if (d.transformOrigin)
		overrides += `\n  transform-origin: ${d.transformOrigin} !important;`;
	overrides += `\n}\n`;

	if (isCorner && d.transformOrigin) {
		overrides += `::view-transition-old(root) {
  transform-origin: ${d.transformOrigin} !important;
}\n`;
	}

	return overrides;
}

export function buildTransitionCSS(
	css: string,
	duration: number,
	easing: string,
	direction?: string,
): string {
	let customCSS = css
		.replace(/(\d+(?:\.\d+)?)(ms|s)\b/g, `${duration}ms`)
		.replace(
			/ease-in-out|ease-in\b|ease-out\b|linear|ease\b|steps\([^)]*\)|cubic-bezier\([^)]+\)|var\(--[a-z0-9-]+\)/g,
			easing,
		)
		.replace(
			/(animation:\s*[\w-]+\s+\d+(?:\.\d+)?ms)(?=\s+(?:both|forwards|backwards)|;)/g,
			`$1 ${easing}`,
		);

	if (direction) {
		customCSS += "\n" + getKeyframeOverrides(customCSS, direction);
		customCSS += "\n" + getMaskPositionOverrides(customCSS, direction);
	}

	return customCSS;
}

function injectTransitionCSS(
	css: string,
	duration: number,
	easing: string,
	direction?: string,
): HTMLStyleElement {
	if (activeStyle) {
		activeStyle.remove();
	}

	const style = document.createElement("style");
	style.textContent = buildTransitionCSS(css, duration, easing, direction);
	document.head.appendChild(style);
	activeStyle = style;
	return style;
}

function removeTransitionCSS() {
	if (activeStyle) {
		activeStyle.remove();
		activeStyle = null;
	}
}

export function triggerLiveTransition(
	css: string,
	duration: number,
	easing: string,
	direction?: string,
) {
	if (!document.startViewTransition) {
		const current = getCurrentTheme();
		setTheme(current === "light" ? "dark" : "light");
		return;
	}

	injectTransitionCSS(css, duration, easing, direction);

	const current = getCurrentTheme();
	const next = current === "light" ? "dark" : "light";

	document
		.startViewTransition(() => {
			setTheme(next);
		})
		.finished.finally(() => {
			setTimeout(removeTransitionCSS, 50);
		});
}

export function triggerPageTransition(
	css: string,
	duration: number,
	easing: string,
	pageA: HTMLElement,
	pageB: HTMLElement,
	direction?: string,
) {
	if (!document.startViewTransition) {
		pageA.style.display = "none";
		pageB.style.display = "";
		return;
	}

	injectTransitionCSS(css, duration, easing, direction);

	const transition = document.startViewTransition(() => {
		pageA.style.display = "none";
		pageB.style.display = "";
	});

	transition.finished.finally(() => {
		setTimeout(removeTransitionCSS, 50);
	});
}
