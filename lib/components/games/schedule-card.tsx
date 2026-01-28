import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/lib/components/ui/avatar";
import { Card, CardContent } from "~/lib/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/lib/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/lib/components/ui/select";
import { convert24to12 } from "~/lib/utils/date";
import { playerQueries } from "~/src/queries";
import { Game } from "~/src/types/game";

interface ScheduleCardProps {
  game: Game;
}

function PlayerListDisplay({
  teamId,
  side,
  isOpen,
  filter,
}: {
  teamId: string;
  side: "home" | "away";
  isOpen: boolean;
  filter: string;
}) {
  const { data: players, isLoading } = useQuery({
    ...playerQueries.teamPlayers(teamId),
    enabled: isOpen,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const filteredPlayers = players?.filter((p) => {
    if (filter === "Captain") return p.isCaptain;
    return p.position === filter;
  });

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">
        {side === "home" ? "Home" : "Away"} {filter}s
      </div>
      {isLoading ? (
        <div className="h-16 w-full flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : filteredPlayers && filteredPlayers.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-4">
          {filteredPlayers.map((player) => (
            <Link
              key={player.id}
              to="/players/$playerId"
              params={{ playerId: player.id }}
              className="flex flex-col items-center gap-2 group min-w-[80px]"
            >
              <Avatar className="h-14 w-14 border-2 border-primary/10 group-hover:border-primary transition-colors">
                <AvatarImage src={player.playerUrl || ""} alt={player.name} />
                <AvatarFallback>
                  {player.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <div className="font-bold text-xs group-hover:text-primary transition-colors max-w-[100px] truncate">
                  {player.name}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  #{player.jerseyNumber}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="h-16 flex items-center justify-center text-muted-foreground text-sm italic">
          No {filter}s Found
        </div>
      )}
    </div>
  );
}

export function ScheduleCard({ game }: ScheduleCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState("Captain");

  const dateObj = new Date(game.gameDate);
  const formattedDate = format(dateObj, "EEE, MMM d");
  const venue = game.court ? `${game.location} - ${game.court}` : game.location;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} asChild>
      <Card className="w-full mb-4 hover:shadow-lg transition-all border-l-4 border-l-primary group p-4">
        <CollapsibleTrigger asChild>
          <CardContent className="p-4 cursor-pointer">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Date and Time Section - 20% */}
              <div className="flex flex-col items-center md:items-start min-w-[140px] text-center md:text-left">
                <span className="text-lg font-bold text-primary capitalize">
                  {formattedDate}
                </span>
                <span className="text-sm font-medium text-muted-foreground">
                  {convert24to12(game.startTime)}
                </span>
                <span className="text-xs text-muted-foreground mt-1 bg-muted px-2 py-0.5 rounded-full">
                  {venue}
                </span>
              </div>

              {/* Teams Section - 60% */}
              <div className="flex-1 flex items-center justify-center gap-4 w-full">
                {/* Home Team */}
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div className="h-12 w-12 md:h-16 md:w-16 relative">
                    <img
                      src={
                        game.homeTeamLogo
                          ? `/team_logos/${game.homeTeamLogo}`
                          : "/team_logos/ccbc_logo.png"
                      }
                      alt={game.homeTeamName}
                      className="object-contain w-full h-full"
                    />
                  </div>
                  <span className="text-sm md:text-base font-bold text-center leading-tight">
                    {game.homeTeamName}
                  </span>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <div className="text-2xl font-black text-muted-foreground/20 px-4">
                    VS
                  </div>
                </div>

                {/* Away Team */}
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div className="h-12 w-12 md:h-16 md:w-16 relative">
                    <img
                      src={
                        game.awayTeamLogo
                          ? `/team_logos/${game.awayTeamLogo}`
                          : "/team_logos/ccbc_logo.png"
                      }
                      alt={game.awayTeamName}
                      className="object-contain w-full h-full"
                    />
                  </div>
                  <span className="text-sm md:text-base font-bold text-center leading-tight">
                    {game.awayTeamName}
                  </span>
                </div>
              </div>

              {/* Action Button - 20% */}
              <div className="flex justify-center md:justify-end min-w-[160px] w-full md:w-auto">
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground/50" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground/50" />
                )}
              </div>
            </div>
          </CardContent>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="border-t bg-muted/10 relative">
            <div className="absolute top-2 left-2 z-10 text-center">
              <Select
                value={selectedPosition}
                onValueChange={setSelectedPosition}
              >
                <SelectTrigger className="w-[140px] h-8 text-xs text-center bg-white/80 backdrop-blur-sm">
                  <SelectValue placeholder="Position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Captain">Captains</SelectItem>
                  <SelectItem value="PG">Power Guard</SelectItem>
                  <SelectItem value="SG">Shooting Guard</SelectItem>
                  <SelectItem value="SF">Small Forward</SelectItem>
                  <SelectItem value="PF">Power Forward</SelectItem>
                  <SelectItem value="C">Center</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-row justify-center items-stretch max-w-4xl mx-auto pt-8">
              <div className="flex-1">
                <PlayerListDisplay
                  teamId={game.homeTeamId}
                  side="home"
                  isOpen={isOpen}
                  filter={selectedPosition}
                />
              </div>
              <div className="w-px bg-border my-4" />
              <div className="flex-1">
                <PlayerListDisplay
                  teamId={game.awayTeamId}
                  side="away"
                  isOpen={isOpen}
                  filter={selectedPosition}
                />
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
