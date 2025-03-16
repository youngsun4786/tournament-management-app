import { useQueryClient } from "@tanstack/react-query";
import { createLink, useRouter } from "@tanstack/react-router";
import { LogOut, User } from "lucide-react";
import { useState } from "react";
import { signOut } from "~/app/controllers/auth.api";
import { useAuthenticatedUser } from "~/app/queries";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Switch } from "./ui/switch";

const ItemLink = createLink(DropdownMenuItem);

export function UserMenu() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    data: { user },
  } = useAuthenticatedUser();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    queryClient.resetQueries();
    router.invalidate();
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src="/placeholder.svg?height=32&width=32"
              alt="User avatar"
            />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.meta.username ?? "User"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* <ItemLink
          className="cursor-pointer"
          to="/profile"
          onClick={() => setOpen(false)}
        >
          Profile
        </ItemLink> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <div className="flex items-center justify-between w-full">
            Dark Mode
            <Switch
              // checked={theme === "dark"}
              disabled
              //   onCheckedChange={() =>
              //     setTheme(theme === "light" ? "dark" : "light")
              //   }
            />
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 cursor-pointer"
          onSelect={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
