import { UserRoleType } from "~/app/schemas/auth.schema";
import { supabaseServer } from "./utils/supabase-server";

export async function getUserRoleFromSession() {
  const { data: { session } } = await supabaseServer.auth.getSession();

  if (session?.user) {
    return session.user.user_metadata.role as UserRoleType;
  }

  return null;
}
