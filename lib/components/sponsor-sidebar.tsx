import { sponsors } from "~/lib/config/navigation";

type SponsorSidebarProps = {
  side: "left" | "right";
};

export function SponsorSidebar({ side }: SponsorSidebarProps) {
  const borderClass = side === "left" ? "border-r" : "border-l";

  return (
    <aside
      className={`hidden md:flex w-32 lg:w-48 shrink-0 flex-col gap-8 p-4 bg-gray-50/5 ${borderClass} border-white/10 items-center pt-8`}
      aria-label={`${side === "left" ? "Left" : "Right"} Sponsor`}
    >
      {sponsors.map((sponsor) => (
        <a
          key={sponsor.name}
          href={sponsor.href}
          className="block w-full hover:opacity-80 transition-opacity"
          {...(sponsor.external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          <img
            src={sponsor.imagePath}
            alt={`Sponsor ${sponsor.name}`}
            className="w-full object-contain"
          />
        </a>
      ))}
    </aside>
  );
}
