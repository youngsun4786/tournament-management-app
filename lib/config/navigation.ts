export const menuItems = [
  { label: "Schedule", href: "/schedule", prefetchIntent: true },
  { label: "Players", href: "/players", prefetchIntent: true },
  { label: "Standings", href: "/standings", prefetchIntent: true },
  { label: "Stats", href: "/stats", prefetchIntent: true },
  { label: "Organizers", href: "/organizers", prefetchIntent: false },
] as const;

export const sponsors = [
  {
    name: "Li Yueran Insurance",
    href: "/title-sponsor-1",
    imagePath: "/main_title_sponsors/side/consultant-sponsor.png",
  },
  {
    name: "Gong Law",
    href: "/title-sponsor-2",
    imagePath: "/main_title_sponsors/side/gong-law-sponsor.png",
  },
  {
    name: "Rundle Dental",
    href: "/title-sponsor-3",
    imagePath: "/main_title_sponsors/side/rundle-dental-sponsor.png",
  },
] as const;
