import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function Home() {
    const name = "Jestoni";
    const totalEvent = 2;
    const label = "work";

    const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const today = new Date();
    const dayName = days[today.getDay()];
    const monthName = months[today.getMonth()];

    const eventsDummy = [
        {
            label: "Work",
            color: "bg-amber-100",
            title: "Evening shift",
            description: "Regular work shift",
            date: "01 November",
            start: "5:00 PM",
            end: "11:00 PM",
        },
        {
            label: "Work",
            color: "bg-blue-100",
            title: "Evening shift",
            description: "Regular work shift",
            date: "02 November",
            start: "5:00 PM",
            end: "11:00 PM",
        },
    ];

    const events = eventsDummy.map((event, id) => {
        return (
            <Card key={id} className={`mt-4 shadow-none ${event.color}`}>
                <CardHeader>
                    <CardDescription className="text-slate-600">
                        {event.label}
                    </CardDescription>
                    <CardTitle className="font-normal text-xl">
                        {event.title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-slate-600">
                    <p>{event.description}</p>
                </CardContent>
                <CardFooter className="justify-between">
                    <p className="text-slate-600">{event.date}</p>
                    <br />
                    <p className="space-x-1 text-slate-600">
                        <span>{event.start}</span>
                        <span> - </span>
                        <span>{event.end}</span>
                    </p>
                </CardFooter>
            </Card>
        );
    });

    return (
        <div className="p-4 text-slate-800 font-[family-name:var(--font-geist-sans)]">
            {/* flex flex-col gap-8 row-start-2 items-center sm:items-start */}
            <main className="">
                <div className="flex justify-between">
                    <Avatar className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
                        <AvatarImage src="https://avatars.githubusercontent.com/u/10084955?v=4" />
                        <AvatarFallback>JO</AvatarFallback>
                    </Avatar>
                    <p className="pt-2">
                        {dayName}, {monthName} {today.getDate()}
                    </p>
                </div>

                <div className="mt-8">
                    <p className="text-slate-600">Hello {name},</p>
                    <h1 className="text-3xl">
                        <span>You have</span>
                        {/* num of event */}
                        <span className="text-amber-500 font-semibold">
                            {" "}
                            2{" "}
                        </span>
                        {/* event label */}
                        <span className="text-amber-500 font-semibold">
                            {" "}
                            {label}{" "}
                        </span>
                        <br />
                        <span>waiting for you today.</span>
                    </h1>
                    {/* if none
        Have a good day, {name} wave
        */}
                </div>

                {/* fullscreen flex-1 h-[650px] w-full */}
                <div className="mt-6">
                    {/* 
        selected={date}
        onSelect={setDate} */}
                    <Calendar
                        mode="single"
                        className="h-full w-full flex"
                        classNames={{
                            months: "flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1",
                            month: "space-y-4 w-full flex flex-col",
                            table: "w-full h-full border-collapse space-y-1",
                            head_row: "",
                            row: "w-full mt-2",
                        }}
                    />
                </div>

                <div className="mt-4">{events}</div>
            </main>

            <footer className="row-start-3 flex mt-12 gap-6 flex-wrap items-center justify-center">
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image
                        aria-hidden
                        src="/file.svg"
                        alt="File icon"
                        width={16}
                        height={16}
                    />
                    Dashboard
                </a>
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image
                        aria-hidden
                        src="/window.svg"
                        alt="Window icon"
                        width={16}
                        height={16}
                    />
                    Create Schedule
                </a>
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image
                        aria-hidden
                        src="/globe.svg"
                        alt="Globe icon"
                        width={16}
                        height={16}
                    />
                    Categories
                </a>
            </footer>
        </div>
    );
}
