import { GameService } from './services/game.service';
import { PlayerService } from './services/player.service';
import { TeamService } from './services/team.service';

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

export { gameService, playerService, teamService };
