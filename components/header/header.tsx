import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { format } from "date-fns";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export function Header() {
    const clearClientSideCache = () => {
        localStorage.clear();
        sessionStorage.clear();
    };

    const handleLogout = async () => {
        // Sign out and optionally clear cache
        await signOut({
            callbackUrl: "/", // Redirect to the homepage after logout
        });

        // Perform any additional cache clearing actions here
        clearClientSideCache();
    };

    const { data: session } = useSession();

    const avatar = session ? session.user.image : "";

    return (
        <div className="flex justify-between">
            <div>
                <Link href="/">
                    <Avatar className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
                        <AvatarImage src={avatar} />
                        <AvatarFallback>JO</AvatarFallback>
                    </Avatar>
                </Link>
                <button onClick={handleLogout}>Sign out</button>
            </div>
            <p className="font-semibold text-sm text-right">
                {format(new Date(), "do MMMM")} <br />
                {format(new Date(), "y")}
            </p>
        </div>
    );
}
