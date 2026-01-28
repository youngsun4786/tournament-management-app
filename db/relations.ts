import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
  images: {
    game: r.one.games({
      from: r.images.gameId,
      to: r.games.id,
    }),
  },
  games: {
    images: r.many.images(),
    players: r.many.players({
      from: r.games.id.through(r.playerGameStats.gameId),
      to: r.players.id.through(r.playerGameStats.playerId),
    }),
    teams: r.many.teams({
      from: r.games.id.through(r.teamGameStats.gameId),
      to: r.teams.id.through(r.teamGameStats.teamId),
    }),
    videos: r.many.videos(),
    homeTeam: r.one.teams({
      from: r.games.homeTeamId,
      to: r.teams.id,
    }),
    awayTeam: r.one.teams({
      from: r.games.awayTeamId,
      to: r.teams.id,
    }),
    seasons: r.one.seasons({
      from: r.games.seasonId,
      to: r.seasons.id,
    }),
  },
  players: {
    games: r.many.games(),
    team: r.one.teams({
      from: r.players.teamId,
      to: r.teams.id,
    }),
  },
  teams: {
    players: r.many.players(),
    usersInAuths: r.many.usersInAuth(),
    games: r.many.games({
      from: r.teams.id.through(r.teamGameStats.teamId),
      to: r.games.id.through(r.teamGameStats.gameId),
    }),
    season: r.one.seasons({
      from: r.teams.seasonId,
      to: r.seasons.id,
    }),
  },
  playerGameStats: {
    player: r.one.players({
      from: r.playerGameStats.playerId,
      to: r.players.id,
    }),
    game: r.one.games({
      from: r.playerGameStats.gameId,
      to: r.games.id,
    }),
  },
  usersInAuth: {
    teams: r.many.teams({
      from: r.usersInAuth.id.through(r.profiles.id),
      to: r.teams.id.through(r.profiles.teamId),
    }),
  },
  teamGameStats: {
    team: r.one.teams({
      from: r.teamGameStats.teamId,
      to: r.teams.id,
    }),
    game: r.one.games({
      from: r.teamGameStats.gameId,
      to: r.games.id,
    }),
  },
  seasons: {
    teams: r.many.teams(),
  },
  userRoles: {
    profile: r.one.profiles({
      from: r.userRoles.userId,
      to: r.profiles.id,
    }),
  },
  profiles: {
    userRoles: r.many.userRoles(),
  },
  videos: {
    game: r.one.games({
      from: r.videos.gameId,
      to: r.games.id,
    }),
  },
}));
