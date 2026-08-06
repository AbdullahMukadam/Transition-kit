"use client";

import { useCallback, useEffect, useState } from "react";
import { getCurrentTheme, TRANSITION_CSS, triggerLiveTransition } from "./ThemeToggleButtonVanilla";

interface ThemeToggleButtonProps extends React.ComponentPropsWithoutRef<"button"> {
	transition?: string;
	css?: string;
	duration?: number;
	easing?: string;
}

export const ThemeToggleButton = ({
	transition = "fade",
	css,
	duration,
	easing,
	style,
	...props
}: ThemeToggleButtonProps) => {
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
			style={{
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
				...style,
			}}
			{...props}
		>
			{internalIsDark ? "Light" : "Dark"}
			<span style={{ position: "absolute", width: "1px", height: "1px", padding: 0, margin: "-1px", overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", borderWidth: 0 }}>Toggle theme</span>
		</button>
	);
};
