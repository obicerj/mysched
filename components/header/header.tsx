import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { signOut, useSession } from "next-auth/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
    const clearClientSideCache = () => {
        localStorage.clear();
        sessionStorage.clear();
    };

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/" }); // Redirect to the homepage after logout
        clearClientSideCache();
    };

    const { data: session } = useSession();

    const avatar: string | undefined = session?.user?.image ?? undefined;
    const name = session?.user?.name ?? "Guest";

    return (
        <div className="flex justify-between items-center py-4 pl-2 pr-6">
            <DropdownMenu>
                <div className="relative">
                    <DropdownMenuTrigger asChild className="cursor-pointer">
                        <div className="absolute bottom-[-4px] left-1 transform -translate-x-1/2 z-20 h-4 w-4 rounded-full flex items-center justify-center shadow-lg border-2 border-white bg-gray-300">
                            <ChevronDownIcon className="h-4 w-4 text-black" />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuTrigger
                        asChild
                        className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 bg-gray-200 text-center items-center justify-center"
                    >
                        <div className="relative h-10 w-10">
                            {/* Avatar Component */}
                            <Avatar className="h-full w-full rounded-full cursor-pointer flex text-center items-center justify-center">
                                <AvatarImage
                                    src={avatar}
                                    alt={`${name}'s avatar`}
                                />
                                <AvatarFallback>
                                    {name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </DropdownMenuTrigger>
                </div>
                <DropdownMenuContent className="w-48">
                    {/* <DropdownMenuItem asChild>
                        <a href="/profile" className="w-full text-left">
                            Profile
                        </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <a href="/settings" className="w-full text-left">
                            Settings
                        </a>
                    </DropdownMenuItem> */}
                    <DropdownMenuItem
                        onClick={handleLogout}
                        className="text-red-600"
                    >
                        Sign out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Date Section */}
            <p className="font-semibold text-sm text-right">
                {format(new Date(), "do MMMM")} <br />
                {format(new Date(), "y")}
            </p>
        </div>
    );
}
