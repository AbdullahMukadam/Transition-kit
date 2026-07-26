"use client";

import { Check, Copy, Play } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "#/components/ui/button";
import { triggerLiveTransition } from "#/lib/trigger-transition";

function CopyButton({ text }: { text: string }) {
	const [copied, setCopied] = useState(false);

	async function handleCopy() {
		await navigator.clipboard.writeText(text);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}

	return (
		<button
			type="button"
			onClick={handleCopy}
			className="flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--muted)] px-2.5 py-1 text-xs font-mono text-[var(--muted-foreground)] transition-colors hover:bg-[var(--gray-200)] hover:text-[var(--foreground)] cursor-pointer"
		>
			{copied ? (
				<Check className="size-3 text-green-500" />
			) : (
				<Copy className="size-3" />
			)}
			{copied ? "Copied!" : "Copy"}
		</button>
	);
}

export function TransitionDemo({
	name,
	description,
	css,
	duration,
	easing,
}: {
	name: string;
	description: string;
	css: string;
	duration: number;
	easing: string;
}) {
	const handleTrigger = useCallback(() => {
		triggerLiveTransition(css, duration, easing);
	}, [css, duration, easing]);

	return (
		<div className="not-prose my-4 overflow-hidden rounded-lg border border-[var(--border)]">
			<div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--muted)] px-4 py-2.5">
				<div>
					<span className="text-sm font-medium text-[var(--foreground)]">
						{name}
					</span>
					<p className="text-xs text-[var(--muted-foreground)] mt-0.5">
						{description}
					</p>
				</div>
				<Button
					size="sm"
					variant="outline"
					onClick={handleTrigger}
					className="gap-1.5 shrink-0"
				>
					<Play className="size-3" />
					Try it
				</Button>
			</div>
			<div className="bg-[var(--background)] p-6">
				<div className="flex items-center gap-4">
					<div className="h-16 w-16 rounded-lg bg-[var(--foreground)] flex items-center justify-center">
						<span className="text-xs font-medium text-[var(--background)]">
							Theme
						</span>
					</div>
					<div className="flex-1">
						<p className="text-sm text-[var(--muted-foreground)]">
							Duration: {duration}ms &middot; {easing}
						</p>
						<p className="text-xs text-[var(--muted-foreground)] mt-1">
							Click "Try it" to trigger the transition on the full page
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export function CopyBlock({ code, label }: { code: string; label?: string }) {
	return (
		<div className="not-prose my-4 overflow-hidden rounded-lg border border-[var(--border)]">
			<div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--muted)] px-4 py-2">
				<span className="text-xs font-medium text-[var(--muted-foreground)]">
					{label || "Code"}
				</span>
				<CopyButton text={code} />
			</div>
			<pre className="bg-[var(--muted)] p-4 overflow-x-auto">
				<code className="text-xs font-mono text-[var(--foreground)]">
					{code}
				</code>
			</pre>
		</div>
	);
}
