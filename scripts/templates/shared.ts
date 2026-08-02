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
	localStorage.setItem("theme", theme);
	document.cookie = `_preferred-theme=${theme}; path=/; max-age=31536000`;
}

export const TRANSITION_CSS: Record<string, string> = {
	{{TRANSITION_CSS_ENTRIES}}
};

let activeStyle: HTMLStyleElement | null = null;

function applyThemeTransition(
	target: "light" | "dark",
	css: string,
	duration: number,
	easing: string,
	onApplied?: () => void,
) {
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

export function triggerLiveTransition(css: string, duration: number, easing: string) {
	const next = getCurrentTheme() === "light" ? "dark" : "light";
	triggerThemeTransition(next, css, duration, easing);
}

export function triggerThemeTransition(
	target: "light" | "dark",
	css: string,
	duration: number,
	easing: string,
	onApplied?: () => void,
) {
	applyThemeTransition(target, css, duration, easing, onApplied);
}
