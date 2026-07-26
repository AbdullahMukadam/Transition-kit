import { cn } from '@/lib/utils';

interface GapDividerProps {
  className?: string;
}

export default function GapDivider({ className }: GapDividerProps) {
  return (
    <div
      className={cn(
        'border-y w-full 2xl:h-10 lg:h-7 h-5 bg-card',
        'dark:bg-[repeating-linear-gradient(135deg,#2f2f2f_0px_1px,transparent_1px_10px)] bg-[repeating-linear-gradient(135deg,#f0f0f0_0px_1px,transparent_1px_10px)]',
        className
      )}
    />
  );
}