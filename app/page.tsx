"use client";

import axios from "axios";
import { Checkbox } from "@/components/ui/checkbox";

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

import React, { useEffect, useState } from "react";
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
import { Header } from "@/components/header/header";
import { Summary } from "@/components/sched-summary/summary";
import { SummaryCalendar } from "@/components/sched-summary/summary-calendar";
import { DailySched } from "@/components/sched-summary/daily-sched";
import { FooterNav } from "@/components/nav/footer-nav";

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

    interface Schedule {
        label: string;
        color: string;
        title: string;
        description: string;
        date: string;
        start_time: string;
        end_time: string;
    }

    const [mySchedule, setMySchedule] = useState<Schedule[]>([]);

    const [fetchDate, setFetchDate] = useState<string>("");

    const getDate = (selectedDate: string) => {
        setFetchDate(selectedDate);
    };

    useEffect(() => {
        // Skip fetching if fetchDate is not set
        // console.log(fetchDate);
        // if (!fetchDate);

        const pickDate = fetchDate
            ? fetchDate
            : format(new Date(), "yyyy-MM-dd");

        // console.log(pickDate);

        const fetchSchedules = async () => {
            try {
                const res = await axios.get(`/api/schedule/date/${pickDate}`);
                setMySchedule(res.data);
            } catch (e) {
                console.error("Error fetching schedules:", e.message);
            }
        };
        // axios
        //     .get(`/api/schedule/date/${fetchDate}`)
        //     .then((res) => {
        //         setMySchedule(res.data);
        //     })
        //     .catch((e) => {
        //         console.error("Error fetching schedules:", e.message);
        //     });
        fetchSchedules();
    }, [fetchDate]);

    const sortedSched = mySchedule.sort(
        (a, b) =>
            new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    );

    // const totalSchedToday = mySchedule.reduce((count, sched) => {
    //     return isToday(sched.date) ? count + 1 : count;
    // }, 0);
    const totalSchedToday = mySchedule.length;

    const form = useForm();

    const daySched = sortedSched.map((event, id) => {
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
                        {format(event.date, "dd MMMM")}
                    </p>
                    <br />
                    <p className="space-x-1 text-slate-600">
                        <span>{format(event.start_time, "h:mma")}</span>
                        <span> - </span>
                        <span>{format(event.end_time, "h:mma")}</span>
                    </p>
                </CardFooter>
            </Card>
        );
    });

    return (
        <div className="p-4 text-slate-800 font-[family-name:var(--font-geist-sans)]">
            <main>
                <Header />
                <Summary name={name} totalSchedToday={totalSchedToday} />
                <SummaryCalendar fetchSelectedDate={getDate} />
                {mySchedule.length ? (
                    <DailySched daySched={daySched} />
                ) : (
                    <p className="text-center mt-14 mb-32 text-3xl text-slate-300 font-bold">
                        Your schedule is empty
                    </p>
                )}
            </main>

            <FooterNav />
        </div>
    );
}
