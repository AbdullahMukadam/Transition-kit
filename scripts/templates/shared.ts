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

export function triggerLiveTransition(css: string, duration: number, easing: string) {
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
