import { Link } from "@tanstack/react-router";
import { Blocks, Github, Layers, Package } from "lucide-react";
import { AnimatedThemeToggler } from "#/registry/animated-theme-toggler";

export default function Header() {
	return (
		<div
			className="sticky top-0 z-50 rise-in"
			style={{ animationDelay: "0ms" }}
		>
			<header className="mx-auto max-w-7xl backdrop-blur-2xl rounded-lg bg-[var(--background)]/70 border border-[var(--border)]">
				<div className="flex items-center justify-between px-2 py-3">
					<div className="flex items-center gap-3">
						<Link
							to="/"
							className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)] no-underline"
						>
							<svg
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								role="img"
								aria-label="Transitions logo"
							>
								<path d="M12 2L2 7l10 5 10-5-10-5z" />
								<path d="M2 17l10 5 10-5" />
								<path d="M2 12l10 5 10-5" />
							</svg>
							Transitions
						</Link>

						<nav className="hidden md:flex items-center gap-1 text-sm font-medium text-[var(--muted-foreground)]">
							<Link
								to="/"
								className="flex items-center gap-1.5 rounded-md px-3 py-1.5 hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors no-underline"
								activeOptions={{ exact: true }}
								activeProps={{
									className: "text-[var(--foreground)] bg-[var(--muted)]",
								}}
							>
								<Layers className="size-3.5" />
								Home
							</Link>
							<Link
								to="/templates"
								className="flex items-center gap-1.5 rounded-md px-3 py-1.5 hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors no-underline"
								activeProps={{
									className: "text-[var(--foreground)] bg-[var(--muted)]",
								}}
							>
								<Blocks className="size-3.5" />
								Templates
							</Link>
							<Link
								to="/components/$"
								className="flex items-center gap-1.5 rounded-md px-3 py-1.5 hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors no-underline"
								activeProps={{
									className: "text-[var(--foreground)] bg-[var(--muted)]",
								}}
							>
								<Package className="size-3.5" />
								Components
							</Link>
						</nav>
					</div>

					<div className="flex items-center gap-2">
						<AnimatedThemeToggler />

						<a
							href="https://github.com/nicholasgriffintn/page-transitions"
							className="flex items-center justify-center size-8 rounded-md hover:bg-[var(--muted)] transition-colors text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
							target="_blank"
							rel="noreferrer"
							aria-label="GitHub"
						>
							<Github className="size-4" />
						</a>
					</div>
				</div>
			</header>
		</div>
	);
}
