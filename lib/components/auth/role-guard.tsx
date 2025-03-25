import { ReactNode } from "react";
import { UserRoleType } from "~/app/schemas/auth.schema";
import { useAuth } from "~/lib/hooks/useAuth";

type RoleGuardProps = {
  /**
   * The roles that are allowed to see the children
   */
  roles: UserRoleType[];

  /**
   * Optional fallback component to render if the user doesn't have the required role
   */
  fallback?: ReactNode;

  /**
   * The content to render if the user has the required role
   */
  children: ReactNode;
};

/**
 * A component that conditionally renders its children based on the user's role
 */
export const RoleGuard = ({
  roles,
  fallback = null,
  children,
}: RoleGuardProps) => {
  const { hasRole } = useAuth();

  if (!hasRole(roles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

/**
 * A component that only renders its children if the user is an admin
 */
export const AdminOnly = ({
  fallback = null,
  children,
}: Omit<RoleGuardProps, "roles">) => {
  return (
    <RoleGuard roles={["admin"]} fallback={fallback}>
      {children}
    </RoleGuard>
  );
};

/**
 * A component that only renders its children if the user is a score keeper or admin
 */
export const ScoreKeeperOnly = ({
  fallback = null,
  children,
}: Omit<RoleGuardProps, "roles">) => {
  return (
    <RoleGuard roles={["score-keeper", "admin"]} fallback={fallback}>
      {children}
    </RoleGuard>
  );
};

/**
 * A component that only renders its children if the user is a captain or admin
 */
export const CaptainOnly = ({
  fallback = null,
  children,
}: Omit<RoleGuardProps, "roles">) => {
  return (
    <RoleGuard roles={["captain", "admin"]} fallback={fallback}>
      {children}
    </RoleGuard>
  );
};

/**
 * A component that only renders its children if the user is a player or admin
 */
export const PlayerOnly = ({
  fallback = null,
  children,
}: Omit<RoleGuardProps, "roles">) => {
  return (
    <RoleGuard roles={["player", "admin"]} fallback={fallback}>
      {children}
    </RoleGuard>
  );
};
