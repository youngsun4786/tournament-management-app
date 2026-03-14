import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { menuItems, sponsors } from "~/lib/config/navigation";
import { SignedOut } from "./auth/SignedOut";

interface Team {
  id: string;
  name: string;
  logoUrl: string | null;
}

interface MobileNavProps {
  teams: Team[];
}

export const MobileNav = ({ teams }: MobileNavProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const close = () => setIsOpen(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-600 hover:text-red-500 focus:outline-none"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="md:hidden absolute top-24 left-0 w-full bg-white dark:bg-black shadow-lg border-t border-gray-100 dark:border-gray-800 animate-in slide-in-from-top-5 duration-200 z-50">
          <div className="flex flex-col p-4 space-y-4">
            <div className="font-semibold text-lg px-4 py-2 border-b border-gray-100 dark:border-gray-800">
              Menu
            </div>

            {/* Teams */}
            <div className="flex flex-col space-y-2">
              <div className="px-4 py-2 font-medium text-gray-500 dark:text-gray-400">
                Teams
              </div>
              <div className="grid grid-cols-2 gap-2 px-4">
                {teams.map((team) => (
                  <Link
                    key={team.id}
                    to={`/teams/$teamId`}
                    params={{ teamId: team.id }}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={close}
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

            {/* Sponsors */}
            <div className="flex flex-col space-y-2">
              <div className="px-4 py-2 font-medium text-gray-500 dark:text-gray-400">
                Sponsors
              </div>
              <div className="grid grid-cols-1 gap-2 px-4">
                {sponsors.map((sponsor) => (
                  <Link
                    key={sponsor.name}
                    to={sponsor.href as "/title-sponsor-1"}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={close}
                  >
                    <span className="text-sm">{sponsor.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Menu Items */}
            {menuItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                onClick={close}
              >
                {item.label}
              </Link>
            ))}

            {/* Action Links */}
            <div className="border-t border-gray-100 dark:border-gray-800 my-2 pt-2 flex flex-col gap-2">
              <Link
                to="/contact-us"
                className="px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-md"
                onClick={close}
              >
                Join Our Team
              </Link>
              <Link
                to="/contact-us"
                className="px-4 py-2 bg-red-500 text-white rounded-md text-center hover:bg-red-600"
                onClick={close}
              >
                Contact Us
              </Link>
              <SignedOut>
                <Link
                  to="/sign-in"
                  className="px-4 py-2 text-center border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={close}
                >
                  Login
                </Link>
              </SignedOut>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
