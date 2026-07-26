"use client";

import { useCallback, useEffect, useState } from "react";
import { getCurrentTheme, TRANSITION_CSS, triggerLiveTransition } from "./ThemeToggleSwitchVanilla";

interface ThemeToggleSwitchProps extends React.ComponentPropsWithoutRef<"button"> {
	transition?: string;
	css?: string;
	duration?: number;
	easing?: string;
}

export const ThemeToggleSwitch = ({
	transition = "fade",
	css,
	duration,
	easing,
	style,
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
			role="switch"
			aria-checked={internalIsDark}
			style={{
				display: "inline-flex",
				alignItems: "center",
				width: "2.75rem",
				height: "1.5rem",
				flexShrink: "0",
				cursor: "pointer",
				borderRadius: "9999px",
				border: "2px solid transparent",
				backgroundColor: internalIsDark ? "var(--foreground)" : "var(--muted)",
				transition: "background-color 0.15s",
				outline: "none",
				...style,
			}}
			{...props}
		>
			<span
				style={{
					pointerEvents: "none",
					display: "block",
					width: "1.25rem",
					height: "1.25rem",
					borderRadius: "9999px",
					backgroundColor: "var(--background)",
					boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
					transition: "transform 0.15s",
					transform: internalIsDark ? "translateX(1.25rem)" : "translateX(0)",
				}}
			/>
			<span style={{ position: "absolute", width: "1px", height: "1px", padding: 0, margin: "-1px", overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", borderWidth: 0 }}>Toggle theme</span>
		</button>
	);
};
