import { cn } from "~/lib/utils/cn";

interface StatValueProps {
  label: string;
  value: string | number;
  trend?: "up" | "down" | "neutral";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeStyles = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-4xl",
} as const;

export function StatValue({
  label,
  value,
  trend,
  size = "md",
  className,
}: StatValueProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <span
        className={cn(
          "font-mono font-bold tabular-nums",
          sizeStyles[size],
          trend === "up" && "text-stat-positive",
          trend === "down" && "text-stat-negative",
        )}
      >
        {value}
        {trend === "up" && <span className="ml-1 text-xs">&#9650;</span>}
        {trend === "down" && <span className="ml-1 text-xs">&#9660;</span>}
      </span>
    </div>
  );
}
