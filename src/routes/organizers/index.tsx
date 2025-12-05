import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/organizers/")({
  component: OrganizersPage,
});

interface TeamMember {
  name: string;
  title: string;
  description?: string;
  imageUrl: string;
  logoUrl: string;
}

function OrganizersPage() {
  const teamMembers: TeamMember[] = [
    {
      name: "Parker Xiong",
      title: "Co-president & Organizer",
      imageUrl: "/team_organizers/organizer1.png",
      description: "[ Calgary Brothers ]",
      logoUrl: "/team_logos/calgary-brothers.png",
    },
    {
      name: "Xi He",
      title: "Co-president & Organizer",
      imageUrl: "/team_organizers/organizer2.png",
      description: "[ Team Aegis ]",
      logoUrl: "/team_logos/aegis.png",
    },
  ];

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-medium mb-6">Organizers</h1>

        <div className="w-16 h-1 bg-rose-500 mb-12"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
          {teamMembers.map((member, index) => (
            <div key={index} className="flex space-x-6">
              <div className="flex-shrink-0">
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  className="w-48 h-60 object-cover"
                />
              </div>
              <div className="flex flex-col">
                <h2 className="text-2xl font-medium text-gray-700">
                  {member.name}
                </h2>
                <p className="text-gray-600 mt-1 mb-4">{member.title}</p>
                <div className="flex flex-row items-center gap-x-2">
                  {member.description && (
                    <p className="text-gray-600 mt-4">{member.description}</p>
                  )}
                  <img
                    src={member.logoUrl}
                    alt={member.name}
                    className="w-18 h-18 object-contain"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
