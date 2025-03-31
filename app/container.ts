import { GameService } from './services/game.service';
import { PlayerGameStatsService } from './services/player-game-stats.service';
import { PlayerService } from './services/player.service';
import { SeasonService } from './services/season.service';
import { TeamGameStatsService } from './services/team-game-stats.service';
import { TeamService } from './services/team.service';
import { MediaService } from './services/media.service';
// let gameService: IGameService
// let playerService: IPlayerService;
// let teamService: ITeamService;


// if (process.env.NODE_ENV === 'testing') {
//   gameService = new GameService();
//   playerService = new PlayerService();
//   teamService = new TeamService();
// } else {

// }

const gameService = new GameService();
const playerService = new PlayerService();
const teamService = new TeamService();
const playerGameStatsService = new PlayerGameStatsService();
const teamGameStatsService = new TeamGameStatsService();
const seasonService = new SeasonService();
const mediaService = new MediaService();
export {
   gameService, playerGameStatsService, playerService, seasonService, teamGameStatsService, teamService, mediaService   
};

