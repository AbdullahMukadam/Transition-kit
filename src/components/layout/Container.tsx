import type React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
	children: React.ReactNode;
	className?: string;
}

export default function Container({ children, className }: ContainerProps) {
	return (
		<div className={cn("relative", className)}>
			<div
				className={cn(
					" border 2xl:w-10 lg:w-8 w-5 bg-card h-full",
					"absolute top-0 left-0",
					"dark:bg-[repeating-linear-gradient(135deg,#2f2f2f_0px_1px,transparent_1px_10px)] bg-[repeating-linear-gradient(135deg,#f0f0f0_0px_1px,transparent_1px_10px)]",
				)}
			/>
			{children}
			<div
				className={cn(
					"border 2xl:w-10 lg:w-8 w-5 bg-card h-full",
					"absolute top-0 right-0",
					"dark:bg-[repeating-linear-gradient(135deg,#2f2f2f_0px_1px,transparent_1px_10px)] bg-[repeating-linear-gradient(135deg,#f0f0f0_0px_1px,transparent_1px_10px)]",
				)}
			/>
		</div>
	);
}
