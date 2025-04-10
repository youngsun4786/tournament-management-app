import { useQueryClient } from "@tanstack/react-query";
import { createLink, useNavigate, useRouter } from "@tanstack/react-router";
import { LogOut, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { signOut } from "~/app/controllers/auth.api";
import { useAuthenticatedUser } from "~/app/queries";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/lib/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

const ItemLink = createLink(DropdownMenuItem);

export function UserMenu() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    data: { user },
  } = useAuthenticatedUser();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    queryClient.resetQueries();
    router.invalidate();
    toast.success("Logged out successfully");
    navigate({ to: "/" });
  };

  const handleProfileClick = () => {
    navigate({ to: "/profile" });
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={user.meta.avatarUrl || "/placeholder.svg?height=32&width=32"}
              alt={`${user.meta.firstName} ${user.meta.lastName}`}
              className="object-cover"
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
              {user.meta.firstName} {user.meta.lastName}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={handleProfileClick}
        >
          Profile
        </DropdownMenuItem>
        {user.role === "captain" && (
          <>
            <DropdownMenuSeparator />
            <ItemLink className="cursor-pointer" to="/edit-teams">
              Edit Teams
            </ItemLink>
          </>
        )}
        {user.role === "score-keeper" && (
          <>
            <DropdownMenuSeparator />
            <ItemLink className="cursor-pointer" to="/edit-games">
              Edit Games
            </ItemLink>
          </>
        )}
        {user.role === "admin" && (
          <>
            <DropdownMenuSeparator />
            <ItemLink className="cursor-pointer" to="/admin">
              Admin
            </ItemLink>
          </>
        )}
        {/* <DropdownMenuItem>
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
        <DropdownMenuSeparator /> */}
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
