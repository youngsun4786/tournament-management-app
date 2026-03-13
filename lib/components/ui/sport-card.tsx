import { cn } from "~/lib/utils/cn";

interface SportCardProps extends React.HTMLAttributes<HTMLDivElement> {
  accentColor?: "red" | "gold" | "default";
  children: React.ReactNode;
}

const accentStyles = {
  red: "border-t-4 border-t-league-red",
  gold: "border-t-4 border-t-league-gold",
  default: "border-t-4 border-t-border",
} as const;

export function SportCard({
  accentColor = "default",
  className,
  children,
  ...props
}: SportCardProps) {
  return (
    <div
      className={cn(
        "rounded-sm bg-card text-card-foreground shadow-sm",
        accentStyles[accentColor],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function SportCardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-4 pt-4 pb-2", className)} {...props}>
      {children}
    </div>
  );
}

export function SportCardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-4 pb-4", className)} {...props}>
      {children}
    </div>
  );
}
