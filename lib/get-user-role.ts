import { UserRoleType } from "~/src/schemas/auth.schema";
import { getSupabaseServerClient } from "./utils/supabase-server";

export async function getUserRoleFromSession() {
  const supabase = getSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (session?.user) {
    return session.user.user_metadata.role as UserRoleType;
  }

  return null;
}
