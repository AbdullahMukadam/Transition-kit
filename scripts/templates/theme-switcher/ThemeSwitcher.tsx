"use client";

import { useCallback, useEffect, useState } from "react";
import { getThemeOption, switchTheme, type ThemeOption } from "./ThemeSwitcherVanilla";

const MONITOR_SVG = (
	<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<rect width="20" height="14" x="2" y="3" rx="2" />
		<line x1="8" x2="16" y1="21" y2="21" />
		<line x1="12" x2="12" y1="17" y2="21" />
	</svg>
);

const SUN_SVG = (
	<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<circle cx="12" cy="12" r="4" />
		<path d="M12 2v2" />
		<path d="M12 20v2" />
		<path d="m4.93 4.93 1.41 1.41" />
		<path d="m17.66 17.66 1.41 1.41" />
		<path d="M2 12h2" />
		<path d="M20 12h2" />
		<path d="m6.34 17.66-1.41 1.41" />
		<path d="m19.07 4.93-1.41 1.41" />
	</svg>
);

const MOON_SVG = (
	<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
	</svg>
);

const THEMES: { key: ThemeOption; label: string; icon: React.ReactNode }[] = [
	{ key: "system", label: "System theme", icon: MONITOR_SVG },
	{ key: "light", label: "Light theme", icon: SUN_SVG },
	{ key: "dark", label: "Dark theme", icon: MOON_SVG },
];

interface ThemeSwitcherProps {
	transition?: string;
	css?: string;
	duration?: number;
	easing?: string;
	style?: React.CSSProperties;
}

export const ThemeSwitcher = ({
	transition = "fade",
	css,
	duration,
	easing,
	style,
}: ThemeSwitcherProps) => {
	const [option, setOption] = useState<ThemeOption>("system");
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setOption(getThemeOption());
		setMounted(true);
	}, []);

	const activeIndex = THEMES.findIndex((t) => t.key === option);

	const handleSelect = useCallback(
		(key: ThemeOption) => {
			switchTheme(key, { transition, css, duration, easing });
			setOption(key);
		},
		[transition, css, duration, easing],
	);

	if (!mounted) {
		return null;
	}

	return (
		<div
			role="group"
			aria-label="Theme switcher"
			style={{
				position: "relative",
				display: "inline-flex",
				alignItems: "center",
				borderRadius: "9999px",
				border: "1px solid var(--border)",
				backgroundColor: "var(--background)",
				padding: "0.25rem",
				...style,
			}}
		>
			<span
				aria-hidden
				style={{
					position: "absolute",
					top: "0.25rem",
					left: "0.25rem",
					width: "1.5rem",
					height: "1.5rem",
					borderRadius: "9999px",
					backgroundColor: "var(--muted)",
					transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
					transform: `translateX(${Math.max(0, activeIndex) * 24}px)`,
				}}
			/>
			{THEMES.map(({ key, label, icon }) => (
				<button
					key={key}
					type="button"
					aria-label={label}
					aria-pressed={option === key}
					onClick={() => handleSelect(key)}
					style={{
						position: "relative",
						display: "inline-flex",
						alignItems: "center",
						justifyContent: "center",
						width: "1.5rem",
						height: "1.5rem",
						borderRadius: "9999px",
						color: option === key ? "var(--foreground)" : "var(--muted-foreground)",
						cursor: "pointer",
						transition: "color 0.15s",
					}}
				>
					{icon}
				</button>
			))}
		</div>
	);
};
