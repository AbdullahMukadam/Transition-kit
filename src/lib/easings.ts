export const easings = [
	{ value: "ease-in-out", label: "Ease In Out" },
	{ value: "ease-in", label: "Ease In" },
	{ value: "ease-out", label: "Ease Out" },
	{ value: "linear", label: "Linear" },
	{ value: "cubic-bezier(0.4, 0, 0.2, 1)", label: "Material Standard" },
	{ value: "cubic-bezier(0.0, 0, 0.2, 1)", label: "Material Decelerate" },
	{ value: "cubic-bezier(0.4, 0, 1, 1)", label: "Material Accelerate" },
	{ value: "cubic-bezier(0.16, 1, 0.3, 1)", label: "Expo Out" },
	{ value: "cubic-bezier(0.87, 0, 0.13, 1)", label: "Expo In Out" },
] as const;
