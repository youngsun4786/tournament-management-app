import { isBefore, isSameDay, startOfDay } from "date-fns";
import { Game } from "~/src/types/game";

export type GameStatus = "live" | "upcoming" | "completed" | "cancelled";

export function getGameStatus(game: Game, now: Date): GameStatus {
  if (game.isCompleted) return "completed";
  if (isBefore(startOfDay(new Date(game.gameDate)), startOfDay(now)))
    return "cancelled";
  if (!isSameDay(new Date(game.gameDate), now)) return "upcoming";
  // same-day live window check
  const [hours, minutes] = game.startTime.split(":");
  const gameTime = new Date(game.gameDate);
  gameTime.setHours(parseInt(hours), parseInt(minutes));
  const twoHoursLater = new Date(gameTime);
  twoHoursLater.setHours(gameTime.getHours() + 2);
  if (now >= gameTime && now < twoHoursLater) return "live";
  return "upcoming";
}
