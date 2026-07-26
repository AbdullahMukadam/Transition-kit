import { Button } from "@/components/ui/button";
import { type CategoryId, categories } from "@/data/transitions";

interface CategoryFilterProps {
	selected: CategoryId;
	onSelect: (id: CategoryId) => void;
}

export default function CategoryFilter({
	selected,
	onSelect,
}: CategoryFilterProps) {
	return (
		<div className="flex flex-wrap gap-1.5">
			{categories.map((cat) => (
				<Button
					key={cat.id}
					variant={selected === cat.id ? "default" : "ghost"}
					size="sm"
					onClick={() => onSelect(cat.id)}
					className="rounded-md text-xs font-medium"
				>
					{cat.label}
				</Button>
			))}
		</div>
	);
}
