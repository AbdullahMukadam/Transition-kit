import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { Boxes, LayoutGrid } from "lucide-react";

export function baseOptions(): BaseLayoutProps {
	return {
		nav: {
			title: "Transition Kit",
		},
		githubUrl: "https://github.com/AbdullahMukadam/Transition-kit",
	};
}

export function homeOptions(): BaseLayoutProps {
	return {
		nav: {
			title: "Transition Kit",
		},
		links: [
			{
				icon: <LayoutGrid />,
				text: "Templates",
				url: "/templates",
				active: "nested-url",
			},
			{
				icon: <Boxes />,
				text: "Components",
				url: "/components",
				active: "nested-url",
			},
		],
		githubUrl: "https://github.com/AbdullahMukadam/Transition-kit",
	};
}
