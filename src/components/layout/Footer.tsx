import { ArrowUpRight, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import GapDivider from "./GapDivider";

export default function Footer() {
	const handleRedirect = () => {
		window.open(
			"https://github.com/nicholasgriffintn/page-transitions",
			"_blank",
			"noreferrer",
		);
	};

	return (
		<footer className="relative">
			<div className="absolute inset-x-0 bottom-0 h-80 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,var(--accent),transparent)] opacity-[0.04]" />

			<GapDivider />

			<div className="max-w-7xl mx-auto px-8 py-16 lg:px-20 relative">
				{/* GitHub CTA Section */}
				<div className="flex flex-col items-center text-center mb-16">
					<h2 className="text-2xl font-semibold text-[var(--foreground)] tracking-tight mb-2">
						Open source
					</h2>
					<p className="text-sm text-[var(--muted-foreground)] mb-6 max-w-md">
						Fully open source. Star the repo, report bugs, or contribute a new
						transition template.
					</p>
					<Button onClick={handleRedirect}>
						<Github className="size-4" />
						View on GitHub
						<ArrowUpRight className="size-3.5" />
					</Button>
				</div>

				{/* Footer Links */}
				<div className="flex flex-col items-center justify-center gap-8 md:flex-row md:gap-32 mb-8 text-center">
					<div className="flex flex-col gap-3">
						<h3 className="text-sm font-semibold text-[var(--foreground)] mb-1">
							Product
						</h3>
						<a
							href="/templates"
							className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors no-underline"
						>
							Templates
						</a>
						<a
							href="/"
							className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors no-underline"
						>
							Documentation
						</a>
					</div>
					<div className="flex flex-col gap-3">
						<h3 className="text-sm font-semibold text-[var(--foreground)] mb-1">
							Resources
						</h3>
						<a
							href="https://developer.chrome.com/docs/web-platform/view-transitions"
							className="inline-flex items-center gap-1 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors no-underline"
							target="_blank"
							rel="noreferrer"
						>
							API Docs
							<ArrowUpRight className="size-3" />
						</a>
						<a
							href="https://caniuse.com/view-transitions"
							className="inline-flex items-center gap-1 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors no-underline"
							target="_blank"
							rel="noreferrer"
						>
							Browser Support
							<ArrowUpRight className="size-3" />
						</a>
					</div>
					<div className="flex flex-col gap-3">
						<h3 className="text-sm font-semibold text-[var(--foreground)] mb-1">
							Community
						</h3>
						<a
							href="https://github.com/nicholasgriffintn/page-transitions"
							className="inline-flex items-center gap-1 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors no-underline"
							target="_blank"
							rel="noreferrer"
						>
							GitHub
							<ArrowUpRight className="size-3" />
						</a>
						<a
							href="https://github.com/nicholasgriffintn/page-transitions/issues"
							className="inline-flex items-center gap-1 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors no-underline"
							target="_blank"
							rel="noreferrer"
						>
							Issues
							<ArrowUpRight className="size-3" />
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
