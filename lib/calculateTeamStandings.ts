import { Game } from "~/app/types/game";
import { TeamWithSeason } from "~/app/types/team";

export type TeamStanding = {
    id: string;
    name: string;
    logo_url: string | null;
    wins: number;
    losses: number;
    winPercentage: number;
    homeWins: number;
    homeLosses: number;
    awayWins: number;
    awayLosses: number;
    pointsScored: number;
    pointsAllowed: number;
    streak: {
      type: "W" | "L";
      count: number;
    };
    last5: string; // e.g. "4-1"
};


export const calculateTeamStandings = (teams: TeamWithSeason[], games: Game[]) => {
  // Filter to only completed games
  const completedGames = games.filter((game) => game.is_completed === true);

  // Create map for tracking which teams have actually played games
  const teamsWithGames = new Set<string>();

  // Add teams to the set if they've played games
  completedGames.forEach((game) => {
    teamsWithGames.add(game.home_team_id);
    teamsWithGames.add(game.away_team_id);
  });

  // Only include teams that are in the game data (have actually played games)
  const activeTeams = teams.filter((team) => teamsWithGames.has(team.id));

  // Initialize standings object
  const standings: { [key: string]: TeamStanding } = {};

  // Initialize standings for teams that have actually played games
  activeTeams.forEach((team) => {
    standings[team.id] = {
      id: team.id,
      name: team.name,
      logo_url: team.logo_url,
      wins: 0,
      losses: 0,
      winPercentage: 0,
      homeWins: 0,
      homeLosses: 0,
      awayWins: 0,
      awayLosses: 0,
      pointsScored: 0,
      pointsAllowed: 0,
      streak: {
        type: "W",
        count: 0,
      },
      last5: "0-0",
    };
  });

  // Sort games by date (oldest first) for accurate streak calculation
  completedGames.sort(
    (a, b) => new Date(a.game_date).getTime() - new Date(b.game_date).getTime()
  );
  // Calculate win/loss records
  completedGames.forEach((game) => {
    const homeTeam = standings[game.home_team_id];
    const awayTeam = standings[game.away_team_id];

    if (homeTeam && awayTeam && (game.home_team_score > 0 && game.away_team_score > 0)) {
      // Home team won
      if (game.home_team_score > game.away_team_score) {
        homeTeam.wins++;
        homeTeam.homeWins++;
        awayTeam.losses++;
        awayTeam.awayLosses++;
      }
      // Away team won
      else {
        awayTeam.wins++;
        awayTeam.awayWins++;
        homeTeam.losses++;
        homeTeam.homeLosses++;
      }

      // Update points
      homeTeam.pointsScored += game.home_team_score;
      homeTeam.pointsAllowed += game.away_team_score;
      awayTeam.pointsScored += game.away_team_score;
      awayTeam.pointsAllowed += game.home_team_score;
    }
  });

  // For teams that exist in the standings, calculate streak and last5
  Object.keys(standings).forEach((teamId) => {
    const team = teams.find((t) => t.id === teamId);
    if (!team) return;

    const teamGames = completedGames.filter(
      (game) => game.home_team_id === teamId || game.away_team_id === teamId
    );

    if (teamGames.length === 0) return; // Skip if no games played

    // Sort team games by date (most recent first)
    teamGames.sort(
      (a, b) =>
        new Date(b.game_date).getTime() - new Date(a.game_date).getTime()
    );

    // Calculate streak
    let currentStreak = 0;
    let streakType: "W" | "L" | null = null;

    for (const game of teamGames) {
      const isHomeTeam = game.home_team_id === teamId;
      const homeWon = game.home_team_score > game.away_team_score;
      const teamWon = isHomeTeam ? homeWon : !homeWon;

      if (streakType === null) {
        streakType = teamWon ? "W" : "L";
        currentStreak = 1;
      } else if (
        (streakType === "W" && teamWon) ||
        (streakType === "L" && !teamWon)
      ) {
        currentStreak++;
      } else {
        break;
      }
    }

    if (streakType) {
      standings[teamId].streak = {
        type: streakType,
        count: currentStreak,
      };
    }

    // Calculate last5
    const last5Games = teamGames.slice(0, 5);
    const wins = last5Games.filter((game) => {
      const isHomeTeam = game.home_team_id === teamId;
      const homeWon = game.home_team_score > game.away_team_score;
      return isHomeTeam ? homeWon : !homeWon;
    }).length;

    const losses = last5Games.length - wins;
    standings[teamId].last5 = `${wins}-${losses}`;

    // Calculate win percentage
    const totalGames = standings[teamId].wins + standings[teamId].losses;
    standings[teamId].winPercentage =
      totalGames > 0
        ? parseFloat((standings[teamId].wins / totalGames).toFixed(3))
        : 0;
  });

  // Add teams that haven't played any games yet
  teams.forEach((team) => {
    if (!standings[team.id]) {
      standings[team.id] = {
        id: team.id,
        name: team.name,
        logo_url: team.logo_url,
        wins: 0,
        losses: 0,
        winPercentage: 0,
        homeWins: 0,
        homeLosses: 0,
        awayWins: 0,
        awayLosses: 0,
        pointsScored: 0,
        pointsAllowed: 0,
        streak: {
          type: "L",
          count: 0,
        },
        last5: "0-0",
      };
    }
  });

  // Convert object to array and sort
  return Object.values(standings).sort((a, b) => {
    // First, prioritize teams that have played at least one game
    const aHasPlayed = a.wins + a.losses > 0;
    const bHasPlayed = b.wins + b.losses > 0;
    
    if (aHasPlayed !== bHasPlayed) {
      return aHasPlayed ? -1 : 1; // Teams that have played go first
    }
    
    // Sort by win percentage (descending)
    if (b.winPercentage !== a.winPercentage) {
      return b.winPercentage - a.winPercentage;
    }

    // If same win percentage, sort by total wins
    if (b.wins !== a.wins) {
      return b.wins - a.wins;
    }

    // If same wins, sort by point differential
    const aDiff = a.pointsScored - a.pointsAllowed;
    const bDiff = b.pointsScored - b.pointsAllowed;

    if (bDiff !== aDiff) {
      return bDiff - aDiff;
    }

    // If still tied, alphabetically by name
    return a.name.localeCompare(b.name);
  });
}