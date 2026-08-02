"use client";

import { useState } from "react";
import {
	CodeBlock,
	CodeBlockBody,
	CodeBlockContent,
	CodeBlockCopyButton,
	CodeBlockHeader,
	CodeBlockItem,
} from "#/components/kibo-ui/code-block";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function CodeSection({
	label,
	code,
	variant,
}: {
	label: string;
	code: string | ((variant: string) => string);
	variant?: string;
}) {
	const resolvedCode = typeof code === "function" ? code(variant ?? "") : code;
	return (
		<div className="flex flex-col space-y-2">
			<span className="text-xs font-medium text-muted-foreground">{label}</span>
			<CodeBlock
				data={[{ language: "typescript", filename: label, code: resolvedCode }]}
				defaultValue="typescript"
			>
				<CodeBlockHeader className="justify-end">
					<CodeBlockCopyButton />
				</CodeBlockHeader>
				<CodeBlockBody>
					{(item) => (
						<CodeBlockItem value={item.language} lineNumbers={false}>
							<CodeBlockContent language="typescript">
								{item.code}
							</CodeBlockContent>
						</CodeBlockItem>
					)}
				</CodeBlockBody>
			</CodeBlock>
		</div>
	);
}

interface ComponentShowcaseProps {
	name: string;
	description?: string;
	variants?: { value: string; label: string }[];
	renderVariant?: (variant: string) => React.ReactNode;
	installCode: string;
	usageCode: string | ((variant: string) => string);
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
		<div className="my-6 w-full rounded-lg border bg-background shadow-sm">
			<Tabs defaultValue="preview" className="w-full flex flex-col">
				{/* Header Bar */}
				<div className="flex flex-col items-start justify-between gap-4 border-b bg-muted/40 px-4 py-3 sm:flex-row sm:items-center">
					<div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
						<span className="font-semibold tracking-tight text-foreground">
							{name}
						</span>
						{description && (
							<span className="hidden text-sm text-muted-foreground sm:inline-block">
								- {description}
							</span>
						)}
					</div>

					<div className="flex w-full items-center gap-2 sm:w-auto">
						{variants.length > 1 && (
							<Select
								value={selectedVariant}
								onValueChange={(v) => v && setSelectedVariant(v)}
							>
								<SelectTrigger className="h-8 w-full sm:w-[140px] text-xs">
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

						<TabsList className="h-8 p-1">
							<TabsTrigger value="preview" className="h-6 text-xs">
								Preview
							</TabsTrigger>
							<TabsTrigger value="code" className="h-6 text-xs">
								Code
							</TabsTrigger>
						</TabsList>
					</div>
				</div>

				{/* Preview Tab */}
				<TabsContent value="preview" className="m-0">
					<div className="relative flex min-h-[350px] items-center justify-center rounded-b-lg p-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px]">
						{renderVariant ? (
							renderVariant(selectedVariant)
						) : (
							<span className="text-sm text-muted-foreground">
								No preview available
							</span>
						)}
					</div>
				</TabsContent>

				{/* Code Tab */}
				<TabsContent
					value="code"
					className="m-0 border-t bg-muted/20 p-6 space-y-6 rounded-b-lg"
				>
					{installCode && (
						<CodeSection label="Installation" code={installCode} />
					)}
					{usageCode && (
						<CodeSection
							label="Usage"
							code={usageCode}
							variant={selectedVariant}
						/>
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
}
