import { getCurrentTheme, setTheme, TRANSITION_CSS, triggerLiveTransition } from "../shared";

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
