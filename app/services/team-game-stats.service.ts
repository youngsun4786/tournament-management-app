import { eq } from "drizzle-orm";
import { db as drizzle_db } from "~/db";
import { team_game_stats } from "~/db/schema";
import type { Team } from "../types/team";
import { TeamGameStatsWithTeam } from "../types/team-game-stats";

export interface ITeamGameStatsService {
    getByGameId(gameId: string): Promise<TeamGameStatsWithTeam[]>;
    getByTeamId(teamId: string): Promise<TeamGameStatsWithTeam[]>;
    getTeamStats(): Promise<TeamGameStatsWithTeam[]>;
}

export class TeamGameStatsService implements ITeamGameStatsService {
    private db: typeof drizzle_db;
    
    constructor() {
        this.db = drizzle_db;
    }

    // this should return an array of team game stats with the team -- at most 2
    async getByGameId(gameId: string): Promise<TeamGameStatsWithTeam[]> {
        const teamStats = await this.db.query.team_game_stats.findMany({
            where: eq(team_game_stats.game_id, gameId),
            with: {
                team: true,
            },
        });

        if (!teamStats) {
            throw new Error('Team game stats not found');
        }

        const teamStatsWithTeam = teamStats.map((teamStat) => ({
            tgs_id: teamStat.id,
            game_id: teamStat.game_id,
            team_id: teamStat.team_id,
            points: teamStat.total_points,
            field_goals_made: teamStat.field_goals_made,
            field_goals_attempted: teamStat.field_goals_attempted,
            field_goal_percentage: teamStat.field_goal_percentage,
            two_pointers_made: teamStat.two_pointers_made,
            two_pointers_attempted: teamStat.two_pointers_attempted,
            two_point_percentage: teamStat.two_point_percentage,
            three_pointers_made: teamStat.three_pointers_made,
            three_pointers_attempted: teamStat.three_pointers_attempted,
            three_point_percentage: teamStat.three_point_percentage,
            free_throws_made: teamStat.free_throws_made,
            free_throws_attempted: teamStat.free_throws_attempted,
            free_throw_percentage: teamStat.free_throw_percentage,
            offensive_rebounds: teamStat.offensive_rebounds,
            defensive_rebounds: teamStat.defensive_rebounds,
            total_rebounds: teamStat.total_rebounds,
            assists: teamStat.assists,
            steals: teamStat.steals,
            blocks: teamStat.blocks,
            turnovers: teamStat.turnovers,
            team_fouls: teamStat.team_fouls,
            team: {
                id: teamStat.team!.id,
                name: teamStat.team!.name,
                logo_url: teamStat.team!.logo_url,
                season_id: teamStat.team!.season_id,
                wins: teamStat.team!.wins,
                losses: teamStat.team!.losses,
            } as Omit<Team, "logo_url" | "season_id" | "created_at">,
        }));

        return teamStatsWithTeam;
    }

    async getTeamStats(): Promise<TeamGameStatsWithTeam[]> {
        const teamStats = await this.db.query.team_game_stats.findMany({
            with: {
                team: true,
            },
        });

        if (!teamStats) {
            throw new Error('Team game stats not found');
        }

        const teamStatsWithTeam = teamStats.map((teamStat) => ({
            tgs_id: teamStat.id,
            game_id: teamStat.game_id,
            team_id: teamStat.team_id,
            points: teamStat.total_points,
            field_goals_made: teamStat.field_goals_made,
            field_goals_attempted: teamStat.field_goals_attempted,
            field_goal_percentage: teamStat.field_goal_percentage,
            two_pointers_made: teamStat.two_pointers_made,
            two_pointers_attempted: teamStat.two_pointers_attempted,
            two_point_percentage: teamStat.two_point_percentage,
            three_pointers_made: teamStat.three_pointers_made,
            three_pointers_attempted: teamStat.three_pointers_attempted,
            three_point_percentage: teamStat.three_point_percentage,
            free_throws_made: teamStat.free_throws_made,
            free_throws_attempted: teamStat.free_throws_attempted,
            free_throw_percentage: teamStat.free_throw_percentage,
            offensive_rebounds: teamStat.offensive_rebounds,
            defensive_rebounds: teamStat.defensive_rebounds,
            total_rebounds: teamStat.total_rebounds,
            assists: teamStat.assists,
            steals: teamStat.steals,
            blocks: teamStat.blocks,
            turnovers: teamStat.turnovers,
            team_fouls: teamStat.team_fouls,
            team: {
                id: teamStat.team!.id,
                name: teamStat.team!.name,
                logo_url: teamStat.team!.logo_url,
                season_id: teamStat.team!.season_id,
                wins: teamStat.team!.wins,
                losses: teamStat.team!.losses,
            } as Omit<Team, "logo_url" | "season_id" | "created_at">,
        }));
        return teamStatsWithTeam;
    }

    async getByTeamId(teamId: string): Promise<TeamGameStatsWithTeam[]> {
        const teamStats = await this.db.query.team_game_stats.findMany({
            where: eq(team_game_stats.team_id, teamId),
            with: {
                team: true,
            },
        });

        if (!teamStats) {
            throw new Error('Team game stats not found');
        }

        const teamStatsWithTeam = teamStats.map((teamStat) => ({
            tgs_id: teamStat.id,
            game_id: teamStat.game_id,
            team_id: teamStat.team_id,
            points: teamStat.total_points,
            field_goals_made: teamStat.field_goals_made,
            field_goals_attempted: teamStat.field_goals_attempted,
            field_goal_percentage: teamStat.field_goal_percentage,
            two_pointers_made: teamStat.two_pointers_made,
            two_pointers_attempted: teamStat.two_pointers_attempted,
            two_point_percentage: teamStat.two_point_percentage,
            three_pointers_made: teamStat.three_pointers_made,
            three_pointers_attempted: teamStat.three_pointers_attempted,
            three_point_percentage: teamStat.three_point_percentage,
            free_throws_made: teamStat.free_throws_made,
            free_throws_attempted: teamStat.free_throws_attempted,
            free_throw_percentage: teamStat.free_throw_percentage,
            offensive_rebounds: teamStat.offensive_rebounds,
            defensive_rebounds: teamStat.defensive_rebounds,
            total_rebounds: teamStat.total_rebounds,
            assists: teamStat.assists,
            steals: teamStat.steals,
            blocks: teamStat.blocks,
            turnovers: teamStat.turnovers,
            team_fouls: teamStat.team_fouls,
            team: {
                id: teamStat.team!.id,
                name: teamStat.team!.name,
                logo_url: teamStat.team!.logo_url,
                season_id: teamStat.team!.season_id,
                wins: teamStat.team!.wins,
                losses: teamStat.team!.losses,
            } as Omit<Team, "logo_url" | "season_id" | "created_at">,
        }));

        return teamStatsWithTeam;
    }
}
