import { Link, useRouteContext } from "@tanstack/react-router";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "lib/components/ui/navigation-menu";
import React from "react";
import { cn } from "../utils/cn";
import { SignedIn } from "./auth/SignedIn";
import { SignedOut } from "./auth/SignedOut";
import { ButtonLink } from "./button-link";
import { UserMenu } from "./user-menu";

const menuItems = [
  {
    title: "Schedule",
    href: "/schedule",
    description: "Check out the upcoming games and match times.",
  },
  {
    title: "Players",
    href: "/players",
    description: "Check out league's performers.",
  },
  {
    title: "Standings",
    href: "/standings",
    description: "View the current rankings and team statistics.",
  },
  {
    title: "Stats",
    href: "/stats",
    description: "Explore detailed player and team performance data.",
  },
  {
    title: "Organizers",
    href: "/organizers",
    description: "Meet the organizers of the league.",
  },
  // {
  //   title: "About",
  //   href: "/about",
  // },
];

export const Navbar = () => {
  const { teams: teamInfo } = useRouteContext({ from: "__root__" });
  const teams = teamInfo!.filter((team) => team.name !== "TBD");

  return (
    <nav className=" dark:bg-black/95 dark:text-white shadow-sm shadow-slate-200">
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

          {/* Main Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="gap-2">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-white/10 hover:text-red-500">
                  <div className="flex items-center gap-1 hover:text-red-500">
                    <span className="hover:text-red-500">Teams</span>
                  </div>
                </NavigationMenuTrigger>
                {/* Teams Information */}
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-3 rounded-md shadow-lg bg-white dark:bg-slate-800">
                    {teams.map((team) => (
                      <li key={team.name}>
                        <NavigationMenuItem asChild>
                          <Link
                            to={`/teams/$teamName`}
                            params={{ teamName: team.name }}
                            preload="intent"
                            className="flex items-center text-center gap-3 p-3 w-full rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
                          >
                            <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden">
                              <img
                                src={`/team_logos/${team.logo_url}`}
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
              {menuItems.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <ButtonLink
                    to={item.href}
                    variant="link"
                    className="dark:text-white hover:text-red-500"
                  >
                    {item.title}
                  </ButtonLink>
                </NavigationMenuItem>
              ))}

              {/* History - past games */}
              {/* <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent dark:text-white dark:hover:bg-white/10">
                  <History className="mr-2 h-4 w-4" />
                  History
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">
                            Season 2 Archive
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Complete records and highlights from our previous
                            season.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          href="/"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">
                            Hall of Champions
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Celebrating our league's greatest achievements and
                            players.
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem> */}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Contact Buttons */}
          <div className="flex items-center gap-4">
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
        </div>
      </div>
    </nav>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
