import { MutationCache, QueryClient } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import { toast } from "sonner";
import { ZodError } from "zod";
import { fromError } from "zod-validation-error";
import { DefaultCatchBoundary } from "~/lib/components/DefaultCatchBoundary";
import { NotFound } from "~/lib/components/NotFound";
import { routeTree } from "./routeTree.gen";

function parseZodError(error: Error) {
  try {
    return new ZodError(JSON.parse(error.message));
  } catch {}
}

export function getRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 60 * 60 * 1000, // 1 hour
      },
    },
    mutationCache: new MutationCache({
      onError: (error) => {
        if (error instanceof Error) {
          const zodError = parseZodError(error);
          if (zodError) {
            toast.error(fromError(zodError, { maxIssuesInMessage: 2 }).message);
            return;
          }

          toast.error(error.message);
        } else if (typeof error === "string") {
          toast.error(error);
        }
      },
    }),
  });

  return routerWithQueryClient(
    createTanStackRouter({
      routeTree,
      context: { queryClient },
      defaultPreload: "intent",
      defaultErrorComponent: DefaultCatchBoundary,
      defaultNotFoundComponent: NotFound,
      scrollRestoration: true,
    }),
    queryClient
  );
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
