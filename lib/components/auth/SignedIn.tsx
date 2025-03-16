import { useAuthentication } from "~/app/queries";

export const SignedIn = ({ children }: { children: React.ReactNode }) => {
  const { data } = useAuthentication();

  if (!data.isAuthenticated) return null;

  return <>{children}</>;
};
