import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { TransitionTemplate } from "#/data/transitions";
import { categories } from "#/data/transitions";
import { cn } from "#/lib/utils";
import TransitionCard from "./TransitionCard";

interface TransitionGridProps {
	transitions: TransitionTemplate[];
}

export default function TransitionGrid({ transitions }: TransitionGridProps) {
	const [search, setSearch] = useState("");
	const [activeCategory, setActiveCategory] = useState("all");

	const availableCategories = useMemo(() => {
		const cats = new Set(transitions.map((t) => t.category));
		return categories.filter(
			(c) => c.id === "all" || cats.has(c.id as TransitionTemplate["category"]),
		);
	}, [transitions]);

	const filtered = useMemo(() => {
		return transitions.filter((t) => {
			const matchesCategory =
				activeCategory === "all" || t.category === activeCategory;
			const matchesSearch =
				!search ||
				t.name.toLowerCase().includes(search.toLowerCase()) ||
				t.description.toLowerCase().includes(search.toLowerCase());
			return matchesCategory && matchesSearch;
		});
	}, [transitions, activeCategory, search]);

	return (
		<div className="not-prose flex flex-col gap-6">
			{/* Search + filters */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="relative flex-1 max-w-sm">
					<Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
					<input
						type="text"
						placeholder="Search transitions..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] pr-3 pl-9 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] outline-none transition-colors focus:border-[var(--foreground)]/30"
					/>
				</div>
				<div className="flex flex-wrap gap-1.5">
					{availableCategories.map((cat) => (
						<button
							key={cat.id}
							type="button"
							onClick={() => setActiveCategory(cat.id)}
							className={cn(
								"cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
								activeCategory === cat.id
									? "bg-[var(--foreground)] text-[var(--background)]"
									: "border border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]",
							)}
						>
							{cat.label}
						</button>
					))}
				</div>
			</div>

			{/* Grid */}
			{filtered.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-20 text-center">
					<p className="mb-1 text-sm font-medium text-[var(--foreground)]">
						No templates found
					</p>
					<p className="text-sm text-[var(--muted-foreground)]">
						Try a different search term or category.
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
					{filtered.map((t, i) => (
						<TransitionCard key={t.slug} transition={t} index={i} />
					))}
				</div>
			)}
		</div>
	);
}
