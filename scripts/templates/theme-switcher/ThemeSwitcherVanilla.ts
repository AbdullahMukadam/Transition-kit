import { getCurrentTheme, setTheme, TRANSITION_CSS, triggerThemeTransition } from "../shared";

export type ThemeOption = "light" | "dark" | "system";

export interface ThemeSwitcherOptions {
	transition?: string;
	css?: string;
	duration?: number;
	easing?: string;
}

export function getThemeOption(): ThemeOption {
	const stored = localStorage.getItem("theme");
	if (stored === "light" || stored === "dark" || stored === "system") return stored;
	return "system";
}

export function setThemeOption(option: ThemeOption) {
	const resolved = resolveTheme(option);
	setTheme(resolved);
	localStorage.setItem("theme", option);
	document.cookie = `_preferred-theme=${option}; path=/; max-age=31536000`;
}

export function resolveTheme(option: ThemeOption): "light" | "dark" {
	if (option === "system") {
		return window.matchMedia("(prefers-color-scheme: dark)").matches
			? "dark"
			: "light";
	}
	return option;
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

export function createThemeSwitcher(
	options: ThemeSwitcherOptions = {},
): HTMLDivElement {
	const { transition = "fade", css, duration, easing } = options;

	const MONITOR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>`;
	const SUN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`;
	const MOON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;

	const themes: { key: ThemeOption; label: string; icon: string }[] = [
		{ key: "system", label: "System theme", icon: MONITOR_SVG },
		{ key: "light", label: "Light theme", icon: SUN_SVG },
		{ key: "dark", label: "Dark theme", icon: MOON_SVG },
	];

	const container = document.createElement("div");
	container.setAttribute("role", "group");
	container.setAttribute("aria-label", "Theme switcher");
	Object.assign(container.style, {
		position: "relative",
		display: "inline-flex",
		alignItems: "center",
		borderRadius: "9999px",
		border: "1px solid var(--border)",
		backgroundColor: "var(--background)",
		padding: "0.25rem",
	});

	const pill = document.createElement("span");
	pill.setAttribute("aria-hidden", "true");
	Object.assign(pill.style, {
		position: "absolute",
		top: "0.25rem",
		left: "0.25rem",
		width: "1.5rem",
		height: "1.5rem",
		borderRadius: "9999px",
		backgroundColor: "var(--muted)",
		transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
	});
	container.appendChild(pill);

	const buttons: HTMLButtonElement[] = [];
	themes.forEach((theme) => {
		const button = document.createElement("button");
		button.type = "button";
		button.setAttribute("aria-label", theme.label);
		button.innerHTML = theme.icon;
		Object.assign(button.style, {
			position: "relative",
			display: "inline-flex",
			alignItems: "center",
			justifyContent: "center",
			width: "1.5rem",
			height: "1.5rem",
			borderRadius: "9999px",
			color: "var(--muted-foreground)",
			cursor: "pointer",
			transition: "color 0.15s",
		});
		button.addEventListener("click", () => {
			switchTheme(theme.key, { transition, css, duration, easing });
			updateActive();
		});
		container.appendChild(button);
		buttons.push(button);
	});

	function getActiveIndex(): number {
		const option = getThemeOption();
		return Math.max(0, themes.findIndex((t) => t.key === option));
	}

	function updateActive() {
		const index = getActiveIndex();
		pill.style.transform = `translateX(${index * 24}px)`;
		buttons.forEach((button, i) => {
			const isActive = i === index;
			button.setAttribute("aria-pressed", String(isActive));
			button.style.color = isActive
				? "var(--foreground)"
				: "var(--muted-foreground)";
		});
	}

	const observer = new MutationObserver(() => updateActive());
	observer.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ["class"],
	});

	updateActive();

	return container;
}

export { getCurrentTheme, setTheme, triggerThemeTransition, triggerLiveTransition, TRANSITION_CSS };
