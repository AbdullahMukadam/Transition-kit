import {
	BarChart3,
	Bell,
	Globe,
	Rocket,
	Settings,
	Shield,
	Star,
	Users,
	Zap,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import type { TransitionTemplate } from "#/data/transitions";
import {
	triggerLiveTransition,
	triggerPageTransition,
} from "#/lib/trigger-transition";

const NAV_LINKS = ["Product", "Pricing", "Docs", "Changelog"];

const FEATURES = [
	{
		title: "Previews for every branch",
		copy: "Every push gets a live environment with its own URL.",
		icon: Globe,
	},
	{
		title: "Reviews that keep moving",
		copy: "Assign, comment, and approve in one place.",
		icon: Users,
	},
	{
		title: "Rollbacks in one click",
		copy: "Restore the last good release in seconds.",
		icon: Rocket,
	},
];

const STATS = [
	{ label: "Deploys this week", value: "128", change: "+12%", up: true },
	{ label: "Median deploy", value: "2.3s", change: "-18%", up: true },
	{ label: "Success rate", value: "99.2%", change: "-0.4%", up: false },
];

const DASH_ROWS = [
	{ name: "feat: onboarding flow", status: "Ready", time: "2m ago" },
	{ name: "fix: checkout race", status: "Deployed", time: "1h ago" },
	{ name: "chore: bump deps", status: "Review", time: "3h ago" },
	{ name: "feat: billing portal", status: "Ready", time: "5h ago" },
	{ name: "fix: auth redirect", status: "Deployed", time: "8h ago" },
];

const ACTIVITY = [
	{ action: "Deployed", target: "feat: onboarding", time: "2m ago" },
	{ action: "Merged", target: "fix: checkout race", time: "1h ago" },
	{ action: "Created", target: "chore: bump deps", time: "3h ago" },
	{ action: "Deployed", target: "main branch", time: "5h ago" },
	{ action: "Commented", target: "feat: billing portal", time: "6h ago" },
];

const SETTINGS_ROWS = [
	{ label: "Team members", value: "12", desc: "Active users in workspace" },
	{ label: "API tokens", value: "4", desc: "Active integration tokens" },
	{ label: "Webhooks", value: "7", desc: "Configured webhook endpoints" },
];

function MockLink({
	children,
	className = "",
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<button
			type="button"
			className={`cursor-pointer transition-colors duration-150 ${className}`}
		>
			{children}
		</button>
	);
}

function DashboardPage() {
	return (
		<div className="flex h-full flex-col">
			<section className="px-5 pt-8 pb-4 text-center sm:px-8 sm:pt-12">
				<h1 className="mx-auto max-w-xl text-2xl font-semibold tracking-[-0.03em] text-balance text-[var(--foreground)] sm:text-3xl">
					Ship in days, not quarters.
				</h1>
				<p className="mx-auto mt-2 max-w-md text-sm leading-6 text-balance text-[var(--muted-foreground)]">
					Plan the work, preview every change, and deploy with one click.
				</p>
				<div className="mt-4 flex flex-wrap items-center justify-center gap-2">
					<MockLink className="rounded-full bg-[var(--foreground)] px-4 py-1.5 text-sm font-medium text-[var(--background)] hover:opacity-85">
						Start shipping free
					</MockLink>
					<MockLink className="rounded-full border border-[var(--border)] px-4 py-1.5 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--muted)]">
						Book a demo
					</MockLink>
				</div>
			</section>

			<div
				className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 px-5 py-3 sm:px-8"
				aria-label="Featured in"
			>
				{[
					"LaunchWire",
					"DevStack",
					"The Standup",
					"Console Weekly",
					"Shipped",
				].map((name) => (
					<span
						key={name}
						className="font-mono text-[10px] tracking-[0.12em] text-[var(--muted-foreground)] uppercase"
					>
						{name}
					</span>
				))}
			</div>

			<section className="border-t border-[var(--border)] px-5 py-6 sm:px-8">
				<p className="font-mono text-[9px] tracking-[0.2em] text-[var(--muted-foreground)] uppercase">
					How it works
				</p>
				<div className="mt-3 grid gap-2 sm:grid-cols-3">
					{FEATURES.map((feature) => (
						<article
							key={feature.title}
							className="flex flex-col gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] p-3"
						>
							<feature.icon className="size-4 text-[var(--foreground)]" />
							<h3 className="text-xs font-medium text-[var(--foreground)]">
								{feature.title}
							</h3>
							<p className="text-[11px] leading-4 text-[var(--muted-foreground)]">
								{feature.copy}
							</p>
						</article>
					))}
				</div>
			</section>

			<section className="grid grid-cols-3 gap-3 border-t border-[var(--border)] px-5 py-4 sm:px-8">
				{STATS.map((stat) => (
					<div key={stat.label} className="text-center sm:text-left">
						<p className="text-lg font-semibold tracking-[-0.02em] text-[var(--foreground)]">
							{stat.value}
						</p>
						<p className="mt-0.5 text-[10px] text-[var(--muted-foreground)]">
							{stat.label}
						</p>
					</div>
				))}
			</section>

			<section className="border-t border-[var(--border)] px-5 py-3 sm:px-8">
				<div className="mb-2 flex items-center justify-between">
					<p className="font-mono text-[9px] tracking-[0.2em] text-[var(--muted-foreground)] uppercase">
						Recent deployments
					</p>
					<span className="text-[10px] text-[var(--muted-foreground)]">
						View all
					</span>
				</div>
				{DASH_ROWS.map((row, index) => (
					<div
						key={row.name}
						className={`flex items-center justify-between py-1.5 ${
							index > 0 ? "border-t border-[var(--border)]" : ""
						}`}
					>
						<p className="truncate font-mono text-[11px] text-[var(--foreground)]">
							{row.name}
						</p>
						<div className="flex shrink-0 items-center gap-2">
							<span className="rounded-full border border-[var(--border)] px-1.5 py-0.5 text-[9px] text-[var(--muted-foreground)]">
								{row.status}
							</span>
							<span className="text-[10px] text-[var(--muted-foreground)]">
								{row.time}
							</span>
						</div>
					</div>
				))}
			</section>

			<section className="border-t border-[var(--border)] px-5 py-3 sm:px-8">
				<div className="mb-2 flex items-center justify-between">
					<p className="font-mono text-[9px] tracking-[0.2em] text-[var(--muted-foreground)] uppercase">
						Activity feed
					</p>
					<span className="text-[10px] text-[var(--muted-foreground)]">
						View all
					</span>
				</div>
				{ACTIVITY.slice(0, 3).map((row, index) => (
					<div
						key={row.target}
						className={`flex items-center justify-between py-1.5 ${
							index > 0 ? "border-t border-[var(--border)]" : ""
						}`}
					>
						<div className="flex items-center gap-2">
							<span className="size-1.5 rounded-full bg-[var(--foreground)]/20" />
							<p className="text-[11px] text-[var(--foreground)]">
								<span className="font-medium">{row.action}</span> {row.target}
							</p>
						</div>
						<span className="text-[10px] text-[var(--muted-foreground)]">
							{row.time}
						</span>
					</div>
				))}
			</section>

			<section className="border-t border-[var(--border)] px-5 py-5 text-center sm:px-8">
				<div
					className="flex items-center justify-center gap-0.5 text-[var(--foreground)]"
					aria-label="5 out of 5 stars"
				>
					{Array.from({ length: 5 }).map((_, i) => (
						<Star key={i} className="size-3 fill-current" />
					))}
				</div>
				<blockquote className="mx-auto mt-2 max-w-md text-sm leading-6 font-medium text-[var(--foreground)]">
					&ldquo;We went from shipping once a month to shipping every
					day.&rdquo;
				</blockquote>
				<p className="mt-1 text-[10px] text-[var(--muted-foreground)]">
					Maya R. &middot; CTO at Northwind
				</p>
			</section>
		</div>
	);
}

function SettingsPage() {
	return (
		<div className="flex h-full flex-col">
			<section className="px-5 pt-8 pb-4 sm:px-8 sm:pt-12">
				<p className="font-mono text-[9px] tracking-[0.2em] text-[var(--muted-foreground)] uppercase">
					Settings
				</p>
				<h1 className="mt-1 text-2xl font-semibold tracking-[-0.02em] text-[var(--foreground)]">
					Workspace
				</h1>
				<p className="mt-1 text-sm text-[var(--muted-foreground)]">
					Manage your team and integrations.
				</p>
			</section>

			<section className="border-t border-[var(--border)] px-5 py-4 sm:px-8">
				<p className="mb-3 text-xs font-medium text-[var(--foreground)]">
					General
				</p>
				<div className="rounded-xl border border-[var(--border)] bg-[var(--card)]">
					{SETTINGS_ROWS.map((row, index) => (
						<div
							key={row.label}
							className={`flex items-center justify-between px-4 py-3 ${
								index > 0 ? "border-t border-[var(--border)]" : ""
							}`}
						>
							<div>
								<p className="text-sm font-medium text-[var(--foreground)]">
									{row.label}
								</p>
								<p className="text-[11px] text-[var(--muted-foreground)]">
									{row.desc}
								</p>
							</div>
							<span className="text-lg font-semibold text-[var(--foreground)]">
								{row.value}
							</span>
						</div>
					))}
				</div>
			</section>

			<section className="border-t border-[var(--border)] px-5 py-4 sm:px-8">
				<p className="mb-3 text-xs font-medium text-[var(--foreground)]">
					Domains
				</p>
				<div className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-[var(--foreground)]">
								Production
							</p>
							<p className="text-[11px] text-[var(--muted-foreground)]">
								app.acme.dev &middot; SSL active
							</p>
						</div>
						<span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600">
							Active
						</span>
					</div>
				</div>
			</section>

			<section className="border-t border-[var(--border)] px-5 py-4 sm:px-8">
				<p className="mb-3 text-xs font-medium text-[var(--foreground)]">
					Security
				</p>
				<div className="rounded-xl border border-[var(--border)] bg-[var(--card)]">
					{[
						{ label: "Two-factor auth", value: "Enabled", icon: Shield },
						{ label: "Audit log", value: "30 days", icon: BarChart3 },
						{ label: "Notifications", value: "Email + Slack", icon: Bell },
					].map((row, index) => (
						<div
							key={row.label}
							className={`flex items-center justify-between px-4 py-3 ${
								index > 0 ? "border-t border-[var(--border)]" : ""
							}`}
						>
							<div className="flex items-center gap-2.5">
								<row.icon className="size-4 text-[var(--muted-foreground)]" />
								<p className="text-sm font-medium text-[var(--foreground)]">
									{row.label}
								</p>
							</div>
							<span className="text-[11px] text-[var(--muted-foreground)]">
								{row.value}
							</span>
						</div>
					))}
				</div>
			</section>

			<section className="border-t border-[var(--border)] px-5 py-4 sm:px-8">
				<p className="mb-3 text-xs font-medium text-[var(--foreground)]">
					Recent Activity
				</p>
				<div className="rounded-xl border border-[var(--border)] bg-[var(--card)]">
					{ACTIVITY.map((row, index) => (
						<div
							key={row.target}
							className={`flex items-center justify-between px-4 py-2.5 ${
								index > 0 ? "border-t border-[var(--border)]" : ""
							}`}
						>
							<div className="flex items-center gap-2">
								<span className="size-1.5 rounded-full bg-[var(--foreground)]/20" />
								<p className="text-[12px] text-[var(--foreground)]">
									<span className="font-medium">{row.action}</span> {row.target}
								</p>
							</div>
							<span className="text-[10px] text-[var(--muted-foreground)]">
								{row.time}
							</span>
						</div>
					))}
				</div>
			</section>
		</div>
	);
}

interface MockSiteProps {
	transitionType?: "theme" | "page";
	transition?: TransitionTemplate;
	duration?: number;
	easing?: string;
	direction?: string;
}

export function MockSite({
	transitionType = "theme",
	transition,
	duration = 400,
	easing = "cubic-bezier(0.4, 0, 0.2, 1)",
	direction,
}: MockSiteProps) {
	const [page, setPage] = useState<"dashboard" | "settings">("dashboard");
	const dashRef = useRef<HTMLDivElement>(null);
	const settingsRef = useRef<HTMLDivElement>(null);

	const handleTryLive = useCallback(() => {
		if (transitionType === "page" && transition) {
			const from = page === "dashboard" ? dashRef : settingsRef;
			const to = page === "dashboard" ? settingsRef : dashRef;

			if (from.current && to.current) {
				triggerPageTransition(
					transition.css,
					duration,
					easing,
					from.current,
					to.current,
					direction,
				);
				setPage((p) => (p === "dashboard" ? "settings" : "dashboard"));
			}
		} else if (transition) {
			triggerLiveTransition(transition.css, duration, easing, direction);
		}
	}, [transitionType, transition, duration, easing, direction, page]);

	return (
		<div className="mx-auto w-full max-w-4xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)] shadow-sm">
			{/* Header */}
			<header className="flex items-center justify-between border-b border-[var(--border)] px-5 py-3 sm:px-8">
				<span className="flex items-center gap-1.5 text-base font-semibold tracking-tight text-[var(--foreground)]">
					<Zap className="size-4 fill-current" />
					Acme
				</span>
				<nav
					className="hidden items-center gap-1 md:flex"
					aria-label="Mock site"
				>
					{NAV_LINKS.map((label) => (
						<MockLink
							key={label}
							className="rounded-full px-3 py-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
						>
							{label}
						</MockLink>
					))}
				</nav>
				<div className="flex items-center gap-2">
					{transition && (
						<button
							type="button"
							onClick={handleTryLive}
							className="flex items-center gap-1.5 rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--muted)]"
						>
							<Zap className="size-3" />
							Try it live
						</button>
					)}
					{transitionType === "page" && (
						<button
							type="button"
							onClick={handleTryLive}
							className="grid size-7 place-items-center rounded-lg text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
							aria-label="Navigate"
						>
							<Settings className="size-3.5" />
						</button>
					)}
					<MockLink className="hidden px-3 py-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] sm:block">
						Sign in
					</MockLink>
					<MockLink className="rounded-full bg-[var(--foreground)] px-4 py-1.5 text-sm font-medium text-[var(--background)] hover:opacity-85">
						Start free
					</MockLink>
				</div>
			</header>

			{/* Pages */}
			<div>
				<div
					ref={dashRef}
					style={{ display: page === "dashboard" ? "" : "none" }}
				>
					<DashboardPage />
				</div>
				<div
					ref={settingsRef}
					style={{ display: page === "settings" ? "" : "none" }}
				>
					<SettingsPage />
				</div>
			</div>

			{/* Footer */}
			<footer className="border-t border-[var(--border)] px-5 py-4 sm:px-8">
				<div className="flex items-center justify-between">
					<span className="flex items-center gap-1.5 text-sm font-semibold tracking-tight text-[var(--foreground)]">
						<Zap className="size-3.5 fill-current" />
						Acme
					</span>
					<p className="text-[10px] text-[var(--muted-foreground)]">
						A demo site for the playground
					</p>
				</div>
			</footer>
		</div>
	);
}
