import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { format } from "date-fns";
import { signOut } from "next-auth/react";
import Link from "next/link";

export function Header({ ...props }) {
    return (
        <div className="flex justify-between">
            <div>
                <Link href="/">
                    <Avatar className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
                        <AvatarImage src={props.avatar} />
                        <AvatarFallback>JO</AvatarFallback>
                    </Avatar>
                </Link>
                <button onClick={() => signOut()}>Sign out</button>
            </div>
            <p className="font-semibold text-sm text-right">
                {format(new Date(), "do MMMM")} <br />
                {format(new Date(), "y")}
            </p>
        </div>
    );
}
