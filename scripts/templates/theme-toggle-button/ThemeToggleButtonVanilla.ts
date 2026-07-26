import { getCurrentTheme, setTheme, TRANSITION_CSS, triggerLiveTransition } from "../shared";

export interface ThemeToggleButtonOptions {
	transition?: string;
	css?: string;
	duration?: number;
	easing?: string;
}

export function createThemeToggleButton(
	options: ThemeToggleButtonOptions = {},
): HTMLButtonElement {
	const { transition = "fade", css, duration, easing } = options;

	const button = document.createElement("button");
	button.type = "button";
	button.setAttribute("aria-label", "Toggle theme");
	Object.assign(button.style, {
		display: "inline-flex",
		alignItems: "center",
		gap: "0.5rem",
		borderRadius: "0.375rem",
		border: "1px solid var(--border)",
		backgroundColor: "var(--background)",
		paddingLeft: "0.75rem",
		paddingRight: "0.75rem",
		paddingTop: "0.375rem",
		paddingBottom: "0.375rem",
		fontSize: "0.875rem",
		fontWeight: "500",
		color: "var(--foreground)",
		cursor: "pointer",
		transition: "background-color 0.15s",
	});

	const srOnly = document.createElement("span");
	srOnly.className = "sr-only";
	srOnly.textContent = "Toggle theme";
	button.appendChild(srOnly);

	function updateText() {
		const isDark = getCurrentTheme() === "dark";
		button.childNodes[0].textContent = isDark ? "Light" : "Dark";
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
		updateText();
	}

	button.addEventListener("click", toggleTheme);

	const observer = new MutationObserver(() => updateText());
	observer.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ["class"],
	});

	updateText();

	return button;
}

export { getCurrentTheme, setTheme, triggerLiveTransition, TRANSITION_CSS };
