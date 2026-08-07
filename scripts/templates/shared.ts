export type ThemeOption = "light" | "dark" | "system";

export function getThemeOption(): ThemeOption {
	const stored = localStorage.getItem("theme");
	if (stored === "light" || stored === "dark" || stored === "system") return stored;
	return "system";
}

export function getCurrentTheme(): "light" | "dark" {
	const el = document.documentElement;
	if (el.classList.contains("dark")) return "dark";
	if (el.classList.contains("light")) return "light";
	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

export function resolveTheme(option: ThemeOption): "light" | "dark" {
	if (option === "system") {
		return window.matchMedia("(prefers-color-scheme: dark)").matches
			? "dark"
			: "light";
	}
	return option;
}

export function setTheme(theme: "light" | "dark") {
	const el = document.documentElement;
	el.classList.remove("light", "dark");
	el.classList.add(theme);
	el.style.colorScheme = theme;
	localStorage.setItem("theme", theme);
	document.cookie = `_preferred-theme=${theme}; path=/; max-age=31536000`;
}

export function setThemeOption(option: ThemeOption) {
	const resolved = resolveTheme(option);
	setTheme(resolved);
	localStorage.setItem("theme", option);
	document.cookie = `_preferred-theme=${option}; path=/; max-age=31536000`;
}

export function switchTheme(
	option: ThemeOption,
	options: { transition?: string; css?: string; duration?: number; easing?: string },
) {
	const resolved = resolveTheme(option);

	if (resolved === getCurrentTheme()) {
		setThemeOption(option);
		return;
	}

	const { transition = "fade", css, duration, easing } = options;
	const t = TRANSITION_CSS[transition];
	const resolvedCSS = css ?? t;
	if (resolvedCSS) {
		const resolvedDuration = duration ?? (t ? undefined : 300);
		const resolvedEasing = easing ?? (t ? undefined : "ease-in-out");
		triggerThemeTransition(
			resolved,
			resolvedCSS,
			resolvedDuration,
			resolvedEasing,
			() => {
				localStorage.setItem("theme", option);
				document.cookie = `_preferred-theme=${option}; path=/; max-age=31536000`;
			},
		);
	} else {
		setThemeOption(option);
	}
}

export const TRANSITION_CSS: Record<string, string> = {
	{{TRANSITION_CSS_ENTRIES}}
};

let activeStyle: HTMLStyleElement | null = null;

function applyThemeTransition(
	target: "light" | "dark",
	css: string,
	duration?: number,
	easing?: string,
	onApplied?: () => void,
) {
	if (activeStyle) {
		activeStyle.remove();
		activeStyle = null;
	}

	let customCSS = css;
	if (duration != null) {
		customCSS = customCSS.replace(/(\d+(?:\.\d+)?)(ms|s)\b/g, `${duration}ms`);
	}
	if (easing != null) {
		customCSS = customCSS
			.replace(
				/ease-in-out|ease-in\b|ease-out\b|linear|ease\b|steps\([^)]*\)|cubic-bezier\([^)]+\)|var\(--[a-z0-9-]+\)/g,
				easing,
			)
			.replace(
				/(animation:\s*[\w-]+\s+\d+(?:\.\d+)?ms)(?=\s+(?:both|forwards|backwards)|;)/g,
				`$1 ${easing}`,
			);
	}

	const style = document.createElement("style");
	style.textContent = customCSS;
	document.head.appendChild(style);
	activeStyle = style;

	const apply = () => {
		setTheme(target);
		onApplied?.();
	};

	if (typeof document.startViewTransition !== "function") {
		apply();
		style.remove();
		activeStyle = null;
		return;
	}

	document
		.startViewTransition(apply)
		.finished.finally(() => {
			setTimeout(() => {
				style.remove();
				activeStyle = null;
			}, 50);
		});
}

export function triggerLiveTransition(
	css: string,
	duration?: number,
	easing?: string,
) {
	const next = getCurrentTheme() === "light" ? "dark" : "light";
	triggerThemeTransition(next, css, duration, easing);
}

export function triggerThemeTransition(
	target: "light" | "dark",
	css: string,
	duration?: number,
	easing?: string,
	onApplied?: () => void,
) {
	applyThemeTransition(target, css, duration, easing, onApplied);
}
