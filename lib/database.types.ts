export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      games: {
        Row: {
          away_team_id: string
          away_team_score: number
          court: string | null
          created_at: string
          game_date: string
          home_team_id: string
          home_team_score: number
          id: string
          is_completed: boolean | null
          location: string | null
          start_time: string
        }
        Insert: {
          away_team_id?: string
          away_team_score?: number
          court?: string | null
          created_at?: string
          game_date: string
          home_team_id?: string
          home_team_score?: number
          id?: string
          is_completed?: boolean | null
          location?: string | null
          start_time: string
        }
        Update: {
          away_team_id?: string
          away_team_score?: number
          court?: string | null
          created_at?: string
          game_date?: string
          home_team_id?: string
          home_team_score?: number
          id?: string
          is_completed?: boolean | null
          location?: string | null
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "games_away_team_id_fkey"
            columns: ["away_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_home_team_id_fkey"
            columns: ["home_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      player_game_stats: {
        Row: {
          assists: number | null
          blocks: number | null
          created_at: string | null
          defensive_rebounds: number | null
          field_goal_percentage: number | null
          field_goals_attempted: number | null
          field_goals_made: number | null
          free_throw_percentage: number | null
          free_throws_attempted: number | null
          free_throws_made: number | null
          game_id: string | null
          id: string
          minutes_played: number | null
          offensive_rebounds: number | null
          personal_fouls: number | null
          player_id: string | null
          plus_minus: number | null
          points: number | null
          steals: number | null
          three_point_percentage: number | null
          three_pointers_attempted: number | null
          three_pointers_made: number | null
          total_rebounds: number | null
          turnovers: number | null
          two_point_percentage: number | null
          two_pointers_attempted: number | null
          two_pointers_made: number | null
          updated_at: string | null
        }
        Insert: {
          assists?: number | null
          blocks?: number | null
          created_at?: string | null
          defensive_rebounds?: number | null
          field_goal_percentage?: number | null
          field_goals_attempted?: number | null
          field_goals_made?: number | null
          free_throw_percentage?: number | null
          free_throws_attempted?: number | null
          free_throws_made?: number | null
          game_id?: string | null
          id?: string
          minutes_played?: number | null
          offensive_rebounds?: number | null
          personal_fouls?: number | null
          player_id?: string | null
          plus_minus?: number | null
          points?: number | null
          steals?: number | null
          three_point_percentage?: number | null
          three_pointers_attempted?: number | null
          three_pointers_made?: number | null
          total_rebounds?: number | null
          turnovers?: number | null
          two_point_percentage?: number | null
          two_pointers_attempted?: number | null
          two_pointers_made?: number | null
          updated_at?: string | null
        }
        Update: {
          assists?: number | null
          blocks?: number | null
          created_at?: string | null
          defensive_rebounds?: number | null
          field_goal_percentage?: number | null
          field_goals_attempted?: number | null
          field_goals_made?: number | null
          free_throw_percentage?: number | null
          free_throws_attempted?: number | null
          free_throws_made?: number | null
          game_id?: string | null
          id?: string
          minutes_played?: number | null
          offensive_rebounds?: number | null
          personal_fouls?: number | null
          player_id?: string | null
          plus_minus?: number | null
          points?: number | null
          steals?: number | null
          three_point_percentage?: number | null
          three_pointers_attempted?: number | null
          three_pointers_made?: number | null
          total_rebounds?: number | null
          turnovers?: number | null
          two_point_percentage?: number | null
          two_pointers_attempted?: number | null
          two_pointers_made?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "player_game_stats_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_game_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      players: {
        Row: {
          created_at: string | null
          height: string | null
          id: string
          jersey_number: number | null
          name: string
          position: string | null
          team_id: string | null
          updated_at: string | null
          weight: string | null
        }
        Insert: {
          created_at?: string | null
          height?: string | null
          id?: string
          jersey_number?: number | null
          name: string
          position?: string | null
          team_id?: string | null
          updated_at?: string | null
          weight?: string | null
        }
        Update: {
          created_at?: string | null
          height?: string | null
          id?: string
          jersey_number?: number | null
          name?: string
          position?: string | null
          team_id?: string | null
          updated_at?: string | null
          weight?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "players_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          team_id: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          team_id?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          team_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      seasons: {
        Row: {
          created_at: string
          end_date: string
          id: string
          is_active: boolean | null
          name: string
          start_date: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          is_active?: boolean | null
          name?: string
          start_date: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          is_active?: boolean | null
          name?: string
          start_date?: string
        }
        Relationships: []
      }
      team_game_stats: {
        Row: {
          assists: number | null
          blocks: number | null
          created_at: string | null
          defensive_rebounds: number | null
          field_goal_percentage: number | null
          field_goals_attempted: number | null
          field_goals_made: number | null
          free_throw_percentage: number | null
          free_throws_attempted: number | null
          free_throws_made: number | null
          game_id: string | null
          id: string
          offensive_rebounds: number | null
          steals: number | null
          team_fouls: number | null
          team_id: string | null
          three_point_percentage: number | null
          three_pointers_attempted: number | null
          three_pointers_made: number | null
          total_points: number | null
          total_rebounds: number | null
          turnovers: number | null
          two_point_percentage: number | null
          two_pointers_attempted: number | null
          two_pointers_made: number | null
          updated_at: string | null
        }
        Insert: {
          assists?: number | null
          blocks?: number | null
          created_at?: string | null
          defensive_rebounds?: number | null
          field_goal_percentage?: number | null
          field_goals_attempted?: number | null
          field_goals_made?: number | null
          free_throw_percentage?: number | null
          free_throws_attempted?: number | null
          free_throws_made?: number | null
          game_id?: string | null
          id?: string
          offensive_rebounds?: number | null
          steals?: number | null
          team_fouls?: number | null
          team_id?: string | null
          three_point_percentage?: number | null
          three_pointers_attempted?: number | null
          three_pointers_made?: number | null
          total_points?: number | null
          total_rebounds?: number | null
          turnovers?: number | null
          two_point_percentage?: number | null
          two_pointers_attempted?: number | null
          two_pointers_made?: number | null
          updated_at?: string | null
        }
        Update: {
          assists?: number | null
          blocks?: number | null
          created_at?: string | null
          defensive_rebounds?: number | null
          field_goal_percentage?: number | null
          field_goals_attempted?: number | null
          field_goals_made?: number | null
          free_throw_percentage?: number | null
          free_throws_attempted?: number | null
          free_throws_made?: number | null
          game_id?: string | null
          id?: string
          offensive_rebounds?: number | null
          steals?: number | null
          team_fouls?: number | null
          team_id?: string | null
          three_point_percentage?: number | null
          three_pointers_attempted?: number | null
          three_pointers_made?: number | null
          total_points?: number | null
          total_rebounds?: number | null
          turnovers?: number | null
          two_point_percentage?: number | null
          two_pointers_attempted?: number | null
          two_pointers_made?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_game_stats_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_game_stats_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string
          id: string
          logo_url: string | null
          losses: number
          name: string
          season_id: string | null
          wins: number
        }
        Insert: {
          created_at?: string
          id?: string
          logo_url?: string | null
          losses?: number
          name?: string
          season_id?: string | null
          wins?: number
        }
        Update: {
          created_at?: string
          id?: string
          logo_url?: string | null
          losses?: number
          name?: string
          season_id?: string | null
          wins?: number
        }
        Relationships: [
          {
            foreignKeyName: "teams_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: number
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: number
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: number
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role: "admin" | "score-keeper" | "player" | "captain"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

