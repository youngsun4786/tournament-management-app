import { Suspense } from "react";
import { useAuthentication } from "~/src/queries";

const SignedOutContent = ({ children }: { children: React.ReactNode }) => {
  const { data } = useAuthentication();

  if (data.isAuthenticated) return null;

  return <>{children}</>;
};

export const SignedOut = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={null}>
      <SignedOutContent>{children}</SignedOutContent>
    </Suspense>
  );
};
