import { cn } from "@/src/lib/utils";

interface BadgeProps {
  variant: "high" | "medium" | "low";
  children: React.ReactNode;
  className?: string;
}

const badgeColors = {
  high: {
    background: "var(--color-risk-high-bg)",
    color: "var(--color-risk-high)",
  },
  medium: {
    background: "var(--color-risk-medium-bg)",
    color: "var(--color-risk-medium)",
  },
  low: {
    background: "var(--color-risk-low-bg)",
    color: "var(--color-risk-low)",
  },
};

export function Badge({ variant, children, className }: BadgeProps) {
  const colors = badgeColors[variant];
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 text-xs font-bold uppercase tracking-wide",
        className
      )}
      style={{
        background: colors.background,
        color: colors.color,
        borderRadius: "var(--radius-badge)",
      }}
    >
      {children}
    </span>
  );
}