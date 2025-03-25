import { Link } from "@tanstack/react-router";
import { UserRoleType } from "~/app/schemas/auth.schema";
import { useAuth } from "~/lib/hooks/useAuth";

export const Nav = () => {
  const { isAuthenticated, user, userRole, signOut } = useAuth();
  console.log("userRole", userRole);
  console.log("isAuthenticated", isAuthenticated);

  // Role-based navigation links
  const getNavLinks = (role?: UserRoleType) => {
    const links = [{ to: "/", label: "Home" }];

    if (role === "admin") {
      links.push({ to: "/admin", label: "Admin" });
    }

    if (role === "admin" || role === "score-keeper") {
      links.push({ to: "/scores", label: "Scores" });
    }

    if (role === "admin" || role === "captain") {
      links.push({ to: "/teams", label: "Teams" });
    }

    return links;
  };

  const navLinks = getNavLinks(userRole as UserRoleType);

  return (
    <nav className="flex justify-between items-center w-full border-b border-gray-200 py-4 px-6 mb-8">
      <div className="flex gap-6 items-center">
        <Link to="/" className="font-bold text-xl">
          CCBC
        </Link>
        <div className="hidden md:flex gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-gray-600 hover:text-black transition-colors"
              activeProps={{ className: "font-bold text-black" }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <span className="hidden md:inline text-sm text-gray-600">
              {user?.meta.firstName} {user?.meta.lastName}
              {userRole && (
                <span className="ml-2 text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                  {userRole}
                </span>
              )}
            </span>
            <button
              onClick={signOut}
              className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link
              to="/sign-in"
              className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-100 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/sign-up"
              className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
