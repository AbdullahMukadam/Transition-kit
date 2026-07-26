"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
			className="inline-flex h-7 items-center justify-center gap-1.5 rounded-md border bg-background/80 px-2.5 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
			aria-label="Copy code"
		>
			{copied ? (
				<>
					<Check className="size-3.5 text-emerald-500" />
					<span className="text-emerald-500 font-medium">Copied</span>
				</>
			) : (
				<>
					<Copy className="size-3.5" />
					<span>Copy</span>
				</>
			)}
		</button>
	);
}

function CodeSection({ label, code }: { label: string; code: string }) {
	return (
		<div className="group relative overflow-hidden rounded-lg border bg-zinc-950 text-zinc-50 dark:bg-zinc-900/90">
			<div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/60 px-4 py-2">
				<span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
					{label}
				</span>
				<CopyButton text={code} />
			</div>
			<pre className="overflow-x-auto p-4 text-xs font-mono leading-relaxed text-zinc-200">
				<code>{code}</code>
			</pre>
		</div>
	);
}

interface ComponentShowcaseProps {
	name: string;
	description?: string;
	variants?: { value: string; label: string }[];
	renderVariant?: (variant: string) => React.ReactNode;
	installCode: string;
	usageCode: string;
}

export default function ComponentShowcase({
	name,
	description,
	variants = [],
	renderVariant,
	installCode,
	usageCode,
}: ComponentShowcaseProps) {
	const [selectedVariant, setSelectedVariant] = useState(
		variants[0]?.value ?? "",
	);

	return (
		<div className="not-prose my-6 w-full">
			<Tabs defaultValue="preview" className="w-full">
				<div className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-xs">
					{/* Header Bar */}
					<div className="flex flex-wrap items-center justify-between gap-3 border-b bg-muted/30 px-4 py-2.5">
						<div className="flex items-center gap-2 min-w-0">
							<span className="text-sm font-semibold tracking-tight text-foreground truncate">
								{name}
							</span>
							{description && (
								<span className="hidden text-xs text-muted-foreground md:inline-block truncate">
									— {description}
								</span>
							)}
						</div>

						<div className="flex items-center gap-2">
							{variants.length > 1 && (
								<Select
									value={selectedVariant}
									onValueChange={(v) => v && setSelectedVariant(v)}
								>
									<SelectTrigger className="h-8 w-[130px] rounded-md border-muted bg-background text-xs shadow-none hover:bg-accent/50 focus:ring-1">
										<SelectValue placeholder="Select variant" />
									</SelectTrigger>
									<SelectContent align="end">
										{variants.map((v) => (
											<SelectItem
												key={v.value}
												value={v.value}
												className="text-xs"
											>
												{v.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}

							<TabsList className="h-8 bg-muted/60 p-0.5">
								<TabsTrigger
									value="preview"
									className="h-7 rounded-sm px-3 text-xs font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs"
								>
									Preview
								</TabsTrigger>
								<TabsTrigger
									value="code"
									className="h-7 rounded-sm px-3 text-xs font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs"
								>
									Code
								</TabsTrigger>
							</TabsList>
						</div>
					</div>

					{/* Preview Tab Content */}
					<TabsContent value="preview" className="m-0 bg-background">
						<div className="relative flex min-h-[200px] items-center justify-center p-8 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px]">
							{renderVariant ? (
								renderVariant(selectedVariant)
							) : (
								<span className="text-xs text-muted-foreground">
									No preview available
								</span>
							)}
						</div>
					</TabsContent>

					{/* Code Tab Content */}
					<TabsContent value="code" className="m-0 p-4 space-y-4 bg-background">
						<CodeSection label="Installation" code={installCode} />
						<CodeSection label="Usage" code={usageCode} />
					</TabsContent>
				</div>
			</Tabs>
		</div>
	);
}
