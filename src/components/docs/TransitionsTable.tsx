"use client";

import { transitions } from "#/data/transitions";

const categories: Record<string, string> = {
	mask: "Mask",
	simple: "Simple",
	"3d": "3D",
	composite: "Composite",
};

export function TransitionsTable() {
	return (
		<div className="not-prose overflow-x-auto my-6">
			<table className="w-full text-sm border-collapse">
				<thead>
					<tr className="border-b border-border">
						<th className="text-left py-2 pr-4 font-medium text-muted-foreground">
							Name
						</th>
						<th className="text-left py-2 pr-4 font-medium text-muted-foreground">
							Category
						</th>
						<th className="text-left py-2 font-medium text-muted-foreground">
							Description
						</th>
					</tr>
				</thead>
				<tbody>
					{transitions.map((t) => (
						<tr key={t.slug} className="border-b border-border/50">
							<td className="py-2 pr-4">
								<code className="text-xs bg-muted px-1.5 py-0.5 rounded">
									{t.slug}
								</code>
							</td>
							<td className="py-2 pr-4 text-muted-foreground">
								{categories[t.category] ?? t.category}
							</td>
							<td className="py-2 text-muted-foreground">{t.description}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
