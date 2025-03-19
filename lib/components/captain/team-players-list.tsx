import { PlusCircle, User } from "lucide-react";
import { Avatar, AvatarFallback } from "~/lib/components/ui/avatar";
import { Badge } from "~/lib/components/ui/badge";
import { Button } from "~/lib/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/lib/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/lib/components/ui/table";

// In a real app, you would create this API function
const getTeamPlayers = async (teamId: string) => {
  // Simplified for demonstration
  const response = await fetch(`/api/teams/${teamId}/players`);
  if (!response.ok) {
    throw new Error("Failed to fetch team players");
  }
  return response.json();
};

// Mock data for demonstration
const mockPlayers = [
  {
    id: "d0e4f073-14fa-4257-83b2-c70ae57961ae",
    name: "Li Pei",
    jersey_number: 10,
    position: "PG",
    height: "6'2\"",
    weight: "185 lbs",
  },
  {
    id: "6690057e-d522-437d-a1d4-70d32ec855e8",
    name: "Youdong Ma",
    jersey_number: 23,
    position: "SF",
    height: "6'6\"",
    weight: "210 lbs",
  },
  {
    id: "bbae11fa-b200-481a-b4a9-86c61085c13c",
    name: "Howard Liou",
    jersey_number: 7,
    position: "SG",
    height: "6'3\"",
    weight: "190 lbs",
  },
  {
    id: "2a44f44a-d311-4f55-bca7-ac4388862ed8",
    name: "Paul Chen",
    jersey_number: 33,
    position: "PF",
    height: "6'8\"",
    weight: "230 lbs",
  },
];

interface TeamPlayersListProps {
  teamId: string;
  onSelectPlayer: (playerId: string) => void;
  showAddStats?: boolean;
}

export const TeamPlayersList = ({
  teamId,
  onSelectPlayer,
  showAddStats = false,
}: TeamPlayersListProps) => {
  // In a real implementation, use this query
  // const { data: players, isLoading } = useQuery({
  //   queryKey: ["teamPlayers", teamId],
  //   queryFn: () => getTeamPlayers(teamId),
  // });

  // Using mock data for demonstration
  const players = mockPlayers;
  const isLoading = false;

  if (isLoading) {
    return <div>Loading players...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="h-5 w-5 mr-2" />
          Team Roster
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Player</TableHead>
              <TableHead>Jersey</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Height</TableHead>
              <TableHead>Weight</TableHead>
              {showAddStats && (
                <TableHead className="text-right">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.map((player) => (
              <TableRow key={player.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarFallback>
                        {player.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    {player.name}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{player.jersey_number}</Badge>
                </TableCell>
                <TableCell>{player.position}</TableCell>
                <TableCell>{player.height}</TableCell>
                <TableCell>{player.weight}</TableCell>
                {showAddStats && (
                  <TableCell className="text-right">
                    <Button size="sm" onClick={() => onSelectPlayer(player.id)}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Stats
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
