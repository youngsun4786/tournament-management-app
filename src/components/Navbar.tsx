import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import { Link } from "@tanstack/react-router";
import { History, Users } from "lucide-react";
import { Button } from "./ui/button";

const teams = [
  {
    title: "Team Dragons",
    href: "/teams/dragons",
    description:
      "Elite division champions known for their aggressive play style.",
  },
  {
    title: "Team Phoenix",
    href: "/teams/phoenix",
    description: "Rising stars with impressive defensive strategies.",
  },
  {
    title: "Team Tigers",
    href: "/teams/tigers",
    description: "Veterans of the league with multiple championships.",
  },
];

const menuItems = [
  {
    title: "Games",
    href: "/games",
  },
  {
    title: "Schedule",
    href: "/schedule",
    description: "Check out the upcoming games and match times.",
  },
  {
    title: "Players",
    href: "/players",
    description: "Stay up-to-date with the latest league announcements.",
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
    title: "About",
    href: "/about",
  },
];

export const Navbar = () => {
  return (
    <nav className=" dark:bg-black/95 dark:text-white shadow-sm shadow-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <div className="flex items-center gap-3 h-18 w-18">
            <img
              className="object-cover"
              src="/public/ccbc_logo.png"
              alt="ccbc_logo"
            />
          </div>

          {/* Main Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="gap-2">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-white/10">
                  <Users className="mr-2 h-4 w-4" />
                  Teams
                </NavigationMenuTrigger>
                {/* Teams Information */}
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                    {teams.map((team) => (
                      <li key={team.href}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={team.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">
                              {team.title}
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {team.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              {menuItems.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <Link to={item.href}>
                    <Button variant="link" className="dark:text-white">
                      {item.title}
                    </Button>
                  </Link>
                </NavigationMenuItem>
              ))}

              {/* History - past games */}
              <NavigationMenuItem>
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
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Contact Buttons */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red hover:bg-red-500/10"
            >
              Join Our Team
            </Button>
            <Button
              size="sm"
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Contact Us
            </Button>
            <Button variant="ghost" size="sm" className="hover:text-red-500">
              Login
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
