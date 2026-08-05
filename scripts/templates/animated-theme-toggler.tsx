"use client";

import { Moon, Sun } from "lucide-react";
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

function triggerLiveTransition(css: string, duration: number, easing: string) {
	if (activeStyle) {
		activeStyle.remove();
		activeStyle = null;
	}

	const style = document.createElement("style");
	const customCSS = css
		.replace(/(\d+(?:\.\d+)?)(ms|s)\b/g, `${duration}ms`)
		.replace(
			/ease-in-out|ease-in\b|ease-out\b|linear|ease\b|steps\([^)]*\)|cubic-bezier\([^)]+\)|var\(--[a-z0-9-]+\)/g,
			easing,
		)
		.replace(
			/(animation:\s*[\w-]+\s+\d+(?:\.\d+)?ms)(?=\s+(?:both|forwards|backwards)|;)/g,
			`$1 ${easing}`,
		);
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

interface AnimatedThemeTogglerProps
	extends React.ComponentPropsWithoutRef<"button"> {
	transition?: string;
	css?: string;
	duration?: number;
	easing?: string;
}

export const AnimatedThemeToggler = ({
	className,
	transition = "fade",
	css,
	duration,
	easing,
	...props
}: AnimatedThemeTogglerProps) => {
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
				resolvedDuration ?? 300,
				resolvedEasing ?? "ease-in-out",
			);
		}
		setInternalIsDark(getCurrentTheme() === "light");
	}, [transition, css, duration, easing]);

	return (
		<button
			type="button"
			onClick={toggleTheme}
			className={cn(
				"inline-flex items-center justify-center rounded-md border border-[var(--border)] bg-[var(--background)] p-2 text-[var(--foreground)] transition-colors hover:bg-[var(--muted)]",
				className,
			)}
			{...props}
		>
			{internalIsDark ? (
				<Sun className="size-4" />
			) : (
				<Moon className="size-4" />
			)}
			<span className="sr-only">Toggle theme</span>
		</button>
	);
};
