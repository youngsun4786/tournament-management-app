import { Separator } from "@radix-ui/react-separator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Mail, User, UserRound } from "lucide-react";
import { toast } from "sonner";
import { updateUser } from "~/app/controllers/auth.api";
import { authQueries, useAuthenticatedUser } from "~/app/queries";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export function ProfileCard() {
  const {
    data: { user },
  } = useAuthenticatedUser();
  const queryClient = useQueryClient();

  const updateUserMutation = useMutation({
    mutationFn: (data: Parameters<typeof updateUser>[0]) => updateUser(data),
    onSuccess: () => {
      toast.success("Your profile has been updated.");
      queryClient.invalidateQueries(authQueries.user());
    },
  });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const teamId = user.meta.teamId!;
    console.log("teamId", teamId);
    updateUserMutation.mutate({ data: { firstName, lastName, teamId } });
  };

  return (
    <form onSubmit={onSubmit} className="w-full max-w-lg mx-auto my-8">
      <Card className="shadow-lg border-0 bg-gradient-to-r from-slate-50 to-white dark:from-gray-900 dark:to-gray-950 overflow-hidden">
        <CardHeader className="pb-4 relative">
          {/* <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 h-24" /> */}
          <div className="relative z-10 flex flex-col items-center pt-4">
            <Avatar className="h-24 w-24 ring-4 ring-white dark:ring-gray-800 shadow-xl">
              <AvatarImage src="/placeholder.svg" alt="User avatar" />
              <AvatarFallback className="bg-gradient-to-br from-rose-400 to-red-600 text-white">
                <UserRound className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            <CardTitle className="mt-4 text-2xl font-bold">
              {user.meta.firstName} {user.meta.lastName}
            </CardTitle>
            <CardDescription className="text-sm opacity-80">
              Manage your personal information
            </CardDescription>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="firstName"
                className="text-sm font-medium flex items-center gap-2"
              >
                <User className="h-4 w-4 opacity-70" />
                First Name
              </Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                defaultValue={user.meta.firstName}
                placeholder="Enter first name"
                className="focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="lastName"
                className="text-sm font-medium flex items-center gap-2"
              >
                <User className="h-4 w-4 opacity-70" />
                Last Name
              </Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                defaultValue={user.meta.lastName}
                placeholder="Enter last name"
                className="focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Mail className="h-4 w-4 opacity-70" />
              Email
              <span className="ml-auto text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded-full">
                Verified
              </span>
            </Label>
            <p className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700">
              {user.email}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end pt-2 pb-6">
          <Button
            type="submit"
            className="bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-700 hover:to-red-800 shadow-md transition-all duration-200"
            disabled={updateUserMutation.isPending}
          >
            {updateUserMutation.isPending ? (
              <>
                Updating <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
