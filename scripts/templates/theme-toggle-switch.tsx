"use client";

import { useCallback, useEffect, useState } from "react";

function cn(...classes: (string | undefined | false)[]) {
	return classes.filter(Boolean).join(" ");
}

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

{{TRANSITION_CSS}}

let activeStyle: HTMLStyleElement | null = null;

function triggerLiveTransition(
	css: string,
	duration?: number,
	easing?: string,
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

interface ThemeToggleSwitchProps
	extends React.ComponentPropsWithoutRef<"button"> {
	transition?: string;
	css?: string;
	duration?: number;
	easing?: string;
}

export const ThemeToggleSwitch = ({
	className,
	transition = "fade",
	css,
	duration,
	easing,
	...props
}: ThemeToggleSwitchProps) => {
	const [internalIsDark, setInternalIsDark] = useState(false);

	useEffect(() => {
		setInternalIsDark(getCurrentTheme() === "dark");
		const observer = new MutationObserver(() =>
			setInternalIsDark(getCurrentTheme() === "dark"),
		);
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["class"],
		});
		return () => observer.disconnect();
	}, []);

	const toggleTheme = useCallback(() => {
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
		setInternalIsDark(getCurrentTheme() === "light");
	}, [transition, css, duration, easing]);

	return (
		<button
			type="button"
			onClick={toggleTheme}
			role="switch"
			aria-checked={internalIsDark}
			className={cn(
				"peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:cursor-not-allowed disabled:opacity-50",
				internalIsDark ? "bg-[var(--foreground)]" : "bg-[var(--muted)]",
				className,
			)}
			{...props}
		>
			<span
				className={cn(
					"pointer-events-none block size-5 rounded-full bg-[var(--background)] shadow-lg ring-0 transition-transform",
					internalIsDark ? "translate-x-5" : "translate-x-0",
				)}
			/>
			<span className="sr-only">Toggle theme</span>
		</button>
	);
};
