import { cn } from "@/src/lib/utils";

interface BadgeProps {
  variant: "high" | "medium" | "low";
  children: React.ReactNode;
}

const badgeColors = {
  high: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  low: "bg-blue-100 text-blue-700 border-blue-200",
};

export function Badge({ variant, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "px-3 py-1 rounded-full text-xs font-semibold border",
        badgeColors[variant]
      )}
    >
      {children}
    </span>
  );
}