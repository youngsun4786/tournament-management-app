import { cn } from "~/lib/utils/cn";

type GameStatus = "live" | "upcoming" | "completed";

interface GameStatusBadgeProps {
  status: GameStatus;
  className?: string;
}

export function GameStatusBadge({ status, className }: GameStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-0.5 py-0.5 text-xs font-bold uppercase tracking-wider",
        status === "live" &&
          "bg-league-red/15 text-league-red animate-pulse",
        status === "upcoming" &&
          "bg-stat-positive/15 text-stat-positive",
        status === "completed" &&
          "border border-border text-muted-foreground",
        className,
      )}
    >
      {status === "live" && (
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
      )}
      {status}
    </span>
  );
}
