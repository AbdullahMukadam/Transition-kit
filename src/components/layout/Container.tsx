import type React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
	children: React.ReactNode;
	className?: string;
}

export default function Container({ children, className }: ContainerProps) {
	return (
		<div className={cn("flex flex-row min-h-screen", className)}>
			<div
				className={cn(
					"border 2xl:w-10 lg:w-8 w-5 bg-card shrink-0",
					"dark:bg-[repeating-linear-gradient(135deg,#2f2f2f_0px_1px,transparent_1px_10px)] bg-[repeating-linear-gradient(135deg,#f0f0f0_0px_1px,transparent_1px_10px)]",
				)}
			/>
			<div className="flex-1 min-w-0">{children}</div>
			<div
				className={cn(
					"border 2xl:w-10 lg:w-8 w-5 bg-card shrink-0",
					"dark:bg-[repeating-linear-gradient(135deg,#2f2f2f_0px_1px,transparent_1px_10px)] bg-[repeating-linear-gradient(135deg,#f0f0f0_0px_1px,transparent_1px_10px)]",
				)}
			/>
		</div>
	);
}
