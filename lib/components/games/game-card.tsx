import { format } from "date-fns";
import { GameStatusBadge } from "~/lib/components/ui/game-status-badge";
import { ButtonLink } from "~/lib/components/button-link";
import { getGameStatus } from "~/lib/utils/game-status";
import { Game } from "~/src/types/game";

function TeamRow({
  name,
  logo,
  score,
  isWinner,
  isCompleted,
}: {
  name?: string | null;
  logo?: string | null;
  score: number;
  isWinner: boolean;
  isCompleted: boolean;
}) {
  const displayName = name || "TBD";
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {logo ? (
          <img
            src={
              displayName === "TBD"
                ? "/team_logos/ccbc_logo.png"
                : `/team_logos/${logo}`
            }
            alt={displayName}
            className="h-8 w-8 object-contain"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-muted" />
        )}
        <span
          className={`font-medium ${isWinner ? "font-bold text-blue-600" : ""}`}
        >
          {displayName}
        </span>
      </div>
      {isCompleted && (
        <span
          className={`text-lg font-mono font-semibold tabular-nums ${isWinner ? "text-blue-600" : ""}`}
        >
          {score}
        </span>
      )}
    </div>
  );
}

export function GameCard({ game }: { game: Game }) {
  const now = new Date();
  const status = getGameStatus(game, now);
  const isCompleted = game.isCompleted;
  const homeWon = isCompleted && game.homeTeamScore > game.awayTeamScore;
  const awayWon = isCompleted && game.awayTeamScore > game.homeTeamScore;

  return (
    <div className="flex h-full flex-col rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-4 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1 text-muted-foreground whitespace-nowrap">
            <span className="font-medium text-foreground">
              {format(new Date(game.gameDate), "MM.dd")}
            </span>
            <span>{format(new Date(game.gameDate), "EEE")}</span>
            <span>&middot;</span>
            <span>
              {new Date(`2000-01-01T${game.startTime}`).toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>
          </div>
          <GameStatusBadge status={status} />
        </div>

        <div className="mb-4 flex flex-1 flex-col gap-3">
          <TeamRow
            name={game.homeTeamName}
            logo={game.homeTeamLogo}
            score={game.homeTeamScore}
            isWinner={homeWon}
            isCompleted={isCompleted}
          />
          <TeamRow
            name={game.awayTeamName}
            logo={game.awayTeamLogo}
            score={game.awayTeamScore}
            isWinner={awayWon}
            isCompleted={isCompleted}
          />
        </div>

        <div className="flex flex-col gap-3 border-t pt-3">
          <div className="flex flex-col text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{game.location}</span>
            {game.court && <span>{game.court}</span>}
          </div>
          <div className="flex gap-2">
            <ButtonLink
              to="/games/$gameId"
              params={{ gameId: game.id }}
              search={{ section: "" }}
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs"
            >
              Details
            </ButtonLink>
            <ButtonLink
              to="/games/$gameId"
              params={{ gameId: game.id }}
              search={{ section: "video-section" }}
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs"
            >
              Highlights
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}
