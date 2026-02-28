import { cn } from "@/src/lib/utils";

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-sm border border-gray-200 p-6",
        className
      )}
    >
      {children}
    </div>
  );
}