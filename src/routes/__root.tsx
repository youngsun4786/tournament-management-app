import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Navbar } from "../components/Navbar";

export const Route = createRootRoute({
  component: () => (
    <>
      <Navbar />
      {/* Place the actual root in this layout */}
      <div className="dark:bg-black/95 dark:text-white h-screen">
        <Outlet />
      </div>
      <TanStackRouterDevtools />
    </>
  ),
});
