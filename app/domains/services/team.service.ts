import { SupabaseClient } from "@supabase/supabase-js";
import { db as drizzle_db } from "~/db";
import { supabaseServer } from "~/lib/utils/supabase-server";

export interface ITeamService {

}

export class TeamService implements ITeamService {
    private supabase: SupabaseClient;
    private drizzle_db: typeof drizzle_db;

    constructor() {
        this.supabase = supabaseServer;
        this.drizzle_db = drizzle_db;
    }

}