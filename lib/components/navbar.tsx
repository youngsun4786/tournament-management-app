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

const sponsors = [
  { name: "Li Yueran Insurance ", href: "/title-sponsor-1" },
  { name: "Gong Law", href: "/title-sponsor-2" },
  { name: "Rundle Dental", href: "/title-sponsor-3" },
];

export const Navbar = () => {
  const { teams: teamInfo } = useRouteContext({ from: "__root__" });
  const teams = teamInfo!.filter((team) => team.name !== "TBD");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

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
                {/* Teams Information */}
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-3 rounded-md shadow-lg bg-white dark:bg-slate-800">
                    {teams.map((team) => (
                      <li key={team.name}>
                        <NavigationMenuItem asChild>
                          <Link
                            to={`/teams/$teamId`}
                            params={{ teamId: team.id }}
                            preload="intent"
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
                    {item.title}
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
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-red-500 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-24 left-0 w-full bg-white dark:bg-black shadow-lg border-t border-gray-100 dark:border-gray-800 animate-in slide-in-from-top-5 duration-200">
          <div className="flex flex-col p-4 space-y-4">
             <div className="font-semibold text-lg px-4 py-2 border-b border-gray-100 dark:border-gray-800">
              Menu
            </div>
            <div className="flex flex-col space-y-2">
               <div className="px-4 py-2 font-medium text-gray-500 dark:text-gray-400">Teams</div>
               <div className="grid grid-cols-2 gap-2 px-4">
                  {teams.map((team) => (
                    <Link
                      key={team.name}
                      to={`/teams/$teamId`}
                      params={{ teamId: team.id }}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                       <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                          <img
                            src={`/team_logos/${team.logoUrl}`}
                            alt={`${team.name} logo`}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      <span className="text-sm">{team.name}</span>
                    </Link>
                  ))}
               </div>
            </div>
            <div className="flex flex-col space-y-2">
               <div className="px-4 py-2 font-medium text-gray-500 dark:text-gray-400">Sponsors</div>
               <div className="grid grid-cols-1 gap-2 px-4">
                  {sponsors.map((sponsor) => (
                    <Link
                      key={sponsor.name}
                      to={sponsor.href}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="text-sm">{sponsor.name}</span>
                    </Link>
                  ))}
               </div>
            </div>

            {menuItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.title}
              </Link>
            ))}
            
            <div className="border-t border-gray-100 dark:border-gray-800 my-2 pt-2 flex flex-col gap-2">
              <Link
                to="/contact-us"
                className="px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Join Our Team
              </Link>
              <Link
                to="/contact-us"
                className="px-4 py-2 bg-red-500 text-white rounded-md text-center hover:bg-red-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact Us
              </Link>
               <SignedOut>
                <Link
                  to="/sign-in"
                  className="px-4 py-2 text-center border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
              </SignedOut>
            </div>
          </div>
        </div>
      )}
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
