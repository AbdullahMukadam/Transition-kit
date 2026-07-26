"use client";

import TransitionGrid from "#/components/transitions/TransitionGrid";
import { transitions } from "#/data/transitions";

export default function TransitionGridMDX({ type }: { type: string }) {
	const filtered = transitions.filter((t) => t.type === type);
	return <TransitionGrid transitions={filtered} />;
}
