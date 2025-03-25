import { redirect } from "@tanstack/react-router";
import { UserRoleType } from "../schemas/auth.schema";
import { getUserRole } from "~/app/controllers/auth.api";
// Define the type for route loader context
export type RouteLoaderContext = {
  context: {
    authState: {
      isAuthenticated: boolean;
    };
  };
};

/**
 * Enforce authentication for a route
 * Use in route loaders to require users to be logged in
 */
export async function requireAuth({ context }: RouteLoaderContext) {
  if (!context.authState.isAuthenticated) {
    throw redirect({ to: "/unauthenticated", statusCode: 401 });
  }
}

/**
 * Enforce role-based access for a route
 * Use in route loaders to restrict access to users with specific roles
 */
export async function requireRole(
  { context }: RouteLoaderContext, 
  allowedRoles: UserRoleType[]
) {
  // First check authentication
  await requireAuth({ context });
  
  // Then check role
  const userRole = await getUserRole();
  
  if (!userRole || !allowedRoles.includes(userRole)) {
    throw redirect({ to: "/unauthorized" });
  }
  
  return userRole;
}

// Role-specific guard functions
export async function requireAdmin(loaderContext: RouteLoaderContext) {
  return requireRole(loaderContext, ["admin"]);
}

export async function requireScoreKeeper(loaderContext: RouteLoaderContext) {
  return requireRole(loaderContext, ["score-keeper", "admin"]);
}

export async function requireCaptain(loaderContext: RouteLoaderContext) {
  return requireRole(loaderContext, ["captain", "admin"]);
}

export async function requirePlayer(loaderContext: RouteLoaderContext) {
  return requireRole(loaderContext, ["player", "admin"]);
}

// Client-side role checking functions
export async function hasRole(requiredRoles: UserRoleType[]): Promise<boolean> {
  const userRole = await getUserRole();
  if (!userRole) return false;
  return requiredRoles.includes(userRole);
}

export async function isAdmin(): Promise<boolean> {
  return hasRole(["admin"]);
}

export async function isScoreKeeper(): Promise<boolean> {
  return hasRole(["score-keeper"]);
}

export async function isCaptain(): Promise<boolean> {
  return hasRole(["captain"]);
}

export async function isPlayer(): Promise<boolean> {
  return hasRole(["player"]);
}
