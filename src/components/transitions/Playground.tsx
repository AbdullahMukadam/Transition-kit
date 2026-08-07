import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { easings } from "@/lib/easings";

interface PlaygroundProps {
	duration: number;
	setDuration: (v: number) => void;
	easing: string;
	setEasing: (v: string) => void;
	direction?: string;
	setDirection?: (v: string) => void;
	hasDirection?: boolean;
	directionOptions?: { label: string; value: string }[];
}

export default function Playground({
	duration,
	setDuration,
	easing,
	setEasing,
	direction,
	setDirection,
	hasDirection = false,
	directionOptions = [],
}: PlaygroundProps) {
	return (
		<div className="space-y-5">
			<div>
				<div className="mb-2 flex items-center justify-between">
					<label
						htmlFor="duration-slider"
						className="text-sm font-medium text-[var(--foreground)]"
					>
						Duration
					</label>
					<span className="rounded-md bg-[var(--muted)] px-2 py-0.5 font-mono text-xs text-[var(--muted-foreground)]">
						{duration}ms
					</span>
				</div>
				<Slider
					value={duration}
					onValueChange={(v: number | readonly number[]) => {
						const val = Array.isArray(v) ? v[0] : v;
						setDuration(val);
					}}
					min={100}
					max={3000}
					step={50}
				/>
			</div>

			<Separator />

			<div>
				<p className="mb-2 block text-sm font-medium text-[var(--foreground)]">
					Easing
				</p>
				<Select
					aria-label="Easing"
					value={easing}
					onValueChange={(v: string | null) => {
						if (v) setEasing(v);
					}}
				>
					<SelectTrigger className="w-full">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{easings.map((e) => (
							<SelectItem key={e.value} value={e.value}>
								{e.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{hasDirection && setDirection && (
				<>
					<Separator />
					<div>
						<p className="mb-2 block text-sm font-medium text-[var(--foreground)]">
							Direction
						</p>
						<Select
							aria-label="Direction"
							value={direction}
							onValueChange={(v: string | null) => {
								if (v) setDirection(v);
							}}
						>
							<SelectTrigger className="w-full">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{directionOptions.map((opt) => (
									<SelectItem key={opt.value} value={opt.value}>
										{opt.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</>
			)}
		</div>
	);
}
