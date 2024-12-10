import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { format } from "date-fns";
import Link from "next/link";

export function Header() {
    return (
        <div className="flex justify-between">
            <Link href="/">
                <Avatar className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
                    <AvatarImage src="https://avatars.githubusercontent.com/u/10084955?v=4" />
                    <AvatarFallback>JO</AvatarFallback>
                </Avatar>
            </Link>
            <p className="font-semibold text-sm text-right">
                {format(new Date(), "do MMMM")} <br />
                {format(new Date(), "y")}
            </p>
        </div>
    );
}
