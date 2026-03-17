import { cn } from "~/lib/utils/cn";
import type { GameStatus } from "~/lib/utils/game-status";

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
        status === "cancelled" &&
          "bg-orange-100/50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
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
