import { GameService, IGameService } from './domains/services/game.service';
import { IPlayerService, PlayerService } from './domains/services/player.service';
import { ITeamService, TeamService } from './domains/services/team.service';

let gameService: IGameService;
let playerService: IPlayerService;
let teamService: ITeamService;


if (process.env.NODE_ENV === 'testing') {
  gameService = new GameService();
  playerService = new PlayerService();
  teamService = new TeamService();
} else {
    gameService = new GameService();
    playerService = new PlayerService();
    teamService = new TeamService();
}

export { gameService, playerService, teamService };
