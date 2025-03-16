import { GameService } from './domains/services/game.service';
import { PlayerService } from './domains/services/player.service';
import { TeamService } from './domains/services/team.service';

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
