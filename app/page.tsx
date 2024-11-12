"use client";

import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
    LightningBoltIcon,
    CardStackPlusIcon,
    StarIcon,
    CalendarIcon,
} from "@radix-ui/react-icons";
import { Calendar, CalendarProps } from "@/components/ui/calendar";
import { format, isToday } from "date-fns";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";

import { useForm } from "react-hook-form";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { useEffect, useState } from "react";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TimePicker } from "@/components/time-picker/time-picker";
import { DatePicker } from "@/components/date-picker/date-picker";

export default function Home() {
    const name = "Jestoni";

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
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    interface Event {
        label: string;
        color: string;
        title: string;
        description: string;
        date: string;
        start: string;
        end: string;
    }

    const eventsDummy: Event[] = [
        {
            label: "Work",
            color: "bg-amber-100",
            title: "Night shift",
            description: "Regular work shift",
            date: "2024-11-02T00:00:00",
            start: "2024-11-02T16:00:00",
            end: "2024-11-02T20:00:00",
        },
        {
            label: "Work",
            color: "bg-blue-100",
            title: "Day shift",
            description: "Regular work shift",
            date: "2024-11-02T00:00:00",
            start: "2024-11-02T08:00:00",
            end: "2024-11-02T15:00:00",
        },
        {
            label: "Sideline",
            color: "bg-red-100",
            title: "Extra job",
            description: "Extra work shift",
            date: "2024-11-02T00:00:00",
            start: "2024-11-02T06:00:00",
            end: "2024-11-02T06:30:00",
        },
    ];

    const totalSchedToday = eventsDummy.reduce((count, sched) => {
        return isToday(sched.start) ? count + 1 : count;
    }, 0);

    const [sched, setSched] = useState(eventsDummy);

    useEffect(() => {
        // Sort events by start time
        const sortSched = eventsDummy.sort(
            (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
        );
        setSched(sortSched);
    }, []);

    const form = useForm();

    const events = sched.map((event, id) => {
        return (
            <Card key={id} className={`mt-4 shadow-none ${event.color}`}>
                <CardHeader>
                    <CardDescription className="flex text-slate-600 justify-between">
                        <Label className="underline underline-offset-8">
                            {event.label}
                        </Label>
                        <Drawer>
                            <DrawerTrigger asChild>
                                <Checkbox className="w-6 h-6 rounded-full border-amber-500 data-[state=checked]:bg-amber-500" />
                            </DrawerTrigger>
                            <DrawerContent>
                                <DrawerHeader>
                                    <DrawerTitle>
                                        Mark this schedule as done?
                                    </DrawerTitle>
                                    <DrawerDescription>
                                        This action cannot be undone.
                                    </DrawerDescription>
                                </DrawerHeader>
                                <DrawerFooter className="flex flex-row justify-center gap-4">
                                    <Button className="bg-amber-500">
                                        Proceed
                                    </Button>
                                    <DrawerClose>Cancel</DrawerClose>
                                </DrawerFooter>
                            </DrawerContent>
                        </Drawer>
                    </CardDescription>
                    <CardTitle className="font-normal text-xl">
                        <Dialog>
                            <DialogTrigger>{event.title}</DialogTrigger>
                            <DialogContent className="text-left">
                                <DialogHeader>
                                    <DialogTitle>
                                        Update {event.title}
                                    </DialogTitle>
                                    {/* <DialogDescription> */}
                                    <Form {...form}>
                                        {/* <form> */}
                                        <FormField
                                            name="title"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem className="text-left mt-4 pt-4">
                                                    <FormLabel>Title</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="e.g. Pickup day shift"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            name="description"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem className="text-left mt-4 pt-4">
                                                    <FormLabel>
                                                        Description
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="e.g. Write short description"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            name="date"
                                            render={(field) => (
                                                <FormItem className="flex flex-col text-left mt-4 pt-4">
                                                    <FormLabel>
                                                        Schedule Date
                                                    </FormLabel>
                                                    <FormControl>
                                                        <DatePicker />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />

                                        <div className="flex gap-12 pb-8 pt-4">
                                            <FormField
                                                name="startTime"
                                                render={({ field }) => (
                                                    <FormItem className="text-left mt-4">
                                                        <FormLabel>
                                                            Start time
                                                        </FormLabel>
                                                        <FormControl>
                                                            <TimePicker
                                                                setDate={
                                                                    field.onChange
                                                                }
                                                                date={
                                                                    field.value
                                                                }
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                name="endtTime"
                                                render={({ field }) => (
                                                    <FormItem className="text-left mt-4">
                                                        <FormLabel>
                                                            End time
                                                        </FormLabel>
                                                        <FormControl>
                                                            <TimePicker
                                                                setDate={
                                                                    field.onChange
                                                                }
                                                                date={
                                                                    field.value
                                                                }
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            className="bg-amber-500 hover:bg-amber-400 mt-4"
                                        >
                                            Update
                                        </Button>
                                        {/* </form> */}
                                    </Form>
                                    {/* </DialogDescription> */}
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-slate-600">
                    <p>{event.description}</p>
                </CardContent>
                <CardFooter className="justify-between">
                    <p className="text-slate-600">
                        {format(event.date, "dd MMMM z")}
                    </p>
                    <br />
                    <p className="space-x-1 text-slate-600">
                        <span>{format(event.start, "h:mma")}</span>
                        <span> - </span>
                        <span>{format(event.end, "h:mma")}</span>
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
                    <p className="font-semibold text-sm pt-2">
                        {format(new Date(), "do MMMM Y")}
                    </p>
                </div>

                <div className="mt-8">
                    <p className="text-xl text-slate-700 font-semibold">
                        Hello {name},
                    </p>
                    <h1 className="text-4xl font-bold">
                        <span>You have</span>
                        {/* num of event */}
                        <span className="text-amber-500">
                            &nbsp;{totalSchedToday}&nbsp;
                        </span>
                        {/* event label */}
                        <span className="text-amber-500">schedule</span>
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

            <footer className="flex mt-12 ">
                <div
                    className="fixed bottom-4 z-10 left-1/2 -translate-x-1/2 w-max flex gap-6 justify-center items-center
        border px-6 py-4 rounded-full border-amber-300 bg-amber-300"
                >
                    <a
                        className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                        href="/"
                        rel="noopener noreferrer"
                    >
                        <LightningBoltIcon />
                        Dashboard
                    </a>
                    {/* <a
                        className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                        href="#"
                        rel="noopener noreferrer"
                    >
                        <CardStackPlusIcon />
                        Create Schedule
                    </a> */}
                    <Dialog>
                        <DialogTrigger className="flex items-center gap-2">
                            <CardStackPlusIcon />
                            <span className="hover:underline hover:underline-offset-4">
                                Create Schedule
                            </span>
                        </DialogTrigger>
                        <DialogContent className="text-left">
                            <DialogHeader>
                                <DialogTitle>Create Schedule</DialogTitle>
                                {/* <DialogDescription> */}
                                <Form {...form}>
                                    {/* <form> */}
                                    <FormField
                                        name="title"
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem className="text-left mt-4 pt-4">
                                                <FormLabel>Title</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g. Pickup day shift"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        name="description"
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem className="text-left mt-4 pt-4">
                                                <FormLabel>
                                                    Description
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g. Write short description"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        name="date"
                                        render={(field) => (
                                            <FormItem className="flex flex-col text-left mt-4 pt-4">
                                                <FormLabel>
                                                    Schedule Date
                                                </FormLabel>
                                                <FormControl>
                                                    <DatePicker />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <div className="flex gap-12 pb-8 pt-4">
                                        <FormField
                                            name="startTime"
                                            render={({ field }) => (
                                                <FormItem className="text-left mt-4">
                                                    <FormLabel>
                                                        Start time
                                                    </FormLabel>
                                                    <FormControl>
                                                        <TimePicker
                                                            setDate={
                                                                field.onChange
                                                            }
                                                            date={field.value}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            name="endtTime"
                                            render={({ field }) => (
                                                <FormItem className="text-left mt-4">
                                                    <FormLabel>
                                                        End time
                                                    </FormLabel>
                                                    <FormControl>
                                                        <TimePicker
                                                            setDate={
                                                                field.onChange
                                                            }
                                                            date={field.value}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="mt-4 bg-amber-500 hover:bg-amber-400"
                                    >
                                        Create
                                    </Button>
                                    {/* </form> */}
                                </Form>
                                {/* </DialogDescription> */}
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                    <a
                        className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                        href="#"
                        rel="noopener noreferrer"
                    >
                        <StarIcon />
                        Labels
                    </a>
                </div>
            </footer>
        </div>
    );
}
