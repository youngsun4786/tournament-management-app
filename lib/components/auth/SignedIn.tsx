import { Suspense } from "react";
import { useAuthentication } from "~/src/queries";

const SignedInContent = ({ children }: { children: React.ReactNode }) => {
  const { data } = useAuthentication();

  if (!data.isAuthenticated) return null;

  return <>{children}</>;
};

export const SignedIn = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={null}>
      <SignedInContent>{children}</SignedInContent>
    </Suspense>
  );
};
