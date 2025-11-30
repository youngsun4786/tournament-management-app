import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { signOut, getUserRole } from "~/src/controllers/auth.api";
import { useAuthentication } from "~/src/queries";
import { UserRoleType } from "~/src/schemas/auth.schema";

export function useAuth() {
  const { data: authState } = useAuthentication();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: userRole, isLoading: isLoadingRole } = useQuery({
    queryKey: ["userRole"],
    queryFn: () => getUserRole(),
    enabled: authState.isAuthenticated,
  });

  const handleLogout = async () => {
    await signOut();
    queryClient.resetQueries();
    navigate({ to: "/sign-in" });
    toast.success("You have been signed out successfully");
  };

  // Role checking functions
  const hasRole = (requiredRoles: UserRoleType[]) => {
    if (!authState.isAuthenticated || !userRole) return false;
    return requiredRoles.includes(userRole as UserRoleType);
  };

  const isAdmin = () => hasRole(["admin"]);
  const isScoreKeeper = () => hasRole(["score-keeper"]);
  const isCaptain = () => hasRole(["captain"]);
  const isPlayer = () => hasRole(["player"]);

  return {
    isAuthenticated: authState.isAuthenticated,
    user: authState.isAuthenticated ? authState.user : null,
    userRole: userRole as UserRoleType | null,
    isLoadingRole,
    hasRole,
    isAdmin,
    isScoreKeeper,
    isCaptain,
    isPlayer,
    signOut: handleLogout,
  };
} 