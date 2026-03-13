import { Link, useRouteContext } from "@tanstack/react-router";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "lib/components/ui/navigation-menu";
import { menuItems, sponsors } from "~/lib/config/navigation";
import { SignedIn } from "./auth/SignedIn";
import { SignedOut } from "./auth/SignedOut";
import { ButtonLink } from "./button-link";
import { MobileNav } from "./mobile-nav";
import { UserMenu } from "./user-menu";

export const Navbar = () => {
  const { teams: teamInfo } = useRouteContext({ from: "__root__" });
  const teams = teamInfo!.filter(
    (team) => team.name !== "TBD" && team.isActive,
  );

  return (
    <nav className="dark:bg-black/95 dark:text-white shadow-sm shadow-slate-200 relative z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <div className="rounded-full p-2 hover:bg-red-500/10">
            <div className="flex items-center gap-3 h-18 w-18">
              <Link to={"/"}>
                <img
                  className="object-cover"
                  src="/ccbc_logo.png"
                  alt="ccbc_logo"
                />
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="gap-2">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-white/10 hover:text-red-500">
                  <div className="flex items-center gap-1 hover:text-red-500">
                    <span className="hover:text-red-500">Teams</span>
                  </div>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-3 rounded-md shadow-lg bg-white dark:bg-slate-800">
                    {teams.map((team) => (
                      <li key={team.id}>
                        <NavigationMenuItem asChild>
                          <Link
                            to={`/teams/$teamId`}
                            params={{ teamId: team.id }}
                            preload={"intent"}
                            className="flex items-center text-center gap-3 p-3 w-full rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
                          >
                            <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden">
                              <img
                                src={`/team_logos/${team.logoUrl}`}
                                alt={`${team.name} logo`}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <span className="text-sm font-medium">
                              {team.name}
                            </span>
                          </Link>
                        </NavigationMenuItem>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-white/10 hover:text-red-500">
                  <div className="flex items-center gap-1 hover:text-red-500">
                    <span className="hover:text-red-500">Sponsors</span>
                  </div>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[300px] rounded-md shadow-lg bg-white dark:bg-slate-800">
                    {sponsors.map((sponsor) => (
                      <li key={sponsor.name}>
                        <NavigationMenuItem asChild>
                          <Link
                            to={sponsor.href}
                            className="flex items-center justify-center text-center p-3 w-full rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
                          >
                            <span className="text-sm font-medium">
                              {sponsor.name}
                            </span>
                          </Link>
                        </NavigationMenuItem>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              {menuItems.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <ButtonLink
                    to={item.href}
                    variant="link"
                    className="dark:text-white hover:text-red-500"
                  >
                    {item.label}
                  </ButtonLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Desktop Contact Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <ButtonLink
              to="/contact-us"
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red hover:bg-red-500/10"
            >
              Join Our Team
            </ButtonLink>
            <ButtonLink
              to="/contact-us"
              size="sm"
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Contact Us
            </ButtonLink>
            <SignedIn>
              <UserMenu />
            </SignedIn>
            <SignedOut>
              <ButtonLink
                to="/sign-in"
                variant={"ghost"}
                size="sm"
                className="hover:text-red-500"
              >
                Login
              </ButtonLink>
            </SignedOut>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <SignedIn>
              <UserMenu />
            </SignedIn>
            <MobileNav teams={teams} />
          </div>
        </div>
      </div>
    </nav>
  );
};
