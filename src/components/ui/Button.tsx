import { cn } from "@/src/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

const variants: Record<string, string> = {
  primary:   "text-white hover:-translate-y-px",
  secondary: "border hover:-translate-y-px",
  danger:    "text-white hover:-translate-y-px",
  ghost:     "hover:bg-[var(--color-gray-100)]",
};

const sizes: Record<string, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const getVariantStyle = (): React.CSSProperties => {
    switch (variant) {
      case "primary":
        return {
          backgroundColor: disabled ? "var(--color-gray-300)" : "var(--color-primary)",
          boxShadow: disabled ? "none" : "0 2px 8px rgba(44, 82, 130, 0.25)",
        };
      case "secondary":
        return {
          backgroundColor: "transparent",
          borderColor: "var(--color-primary)",
          color: "var(--color-primary)",
        };
      case "danger":
        return {
          backgroundColor: disabled ? "var(--color-gray-300)" : "var(--color-risk-high)",
          boxShadow: disabled ? "none" : "0 2px 8px rgba(229, 62, 62, 0.25)",
        };
      case "ghost":
        return {
          color: "var(--color-gray-600)",
        };
      default:
        return {};
    }
  };

  return (
    <button
      className={cn(
        "font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:transform-none",
        variant === "primary" && "focus:ring-[var(--color-primary)]",
        variant === "danger" && "focus:ring-[var(--color-risk-high)]",
        variants[variant],
        sizes[size],
        className
      )}
      style={{
        borderRadius: "var(--radius-button)",
        ...getVariantStyle(),
      }}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}