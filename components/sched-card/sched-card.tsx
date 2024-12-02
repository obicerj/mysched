import React, { useEffect, useState } from "react";
import { format, isToday } from "date-fns";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TimePicker } from "@/components/time-picker/time-picker";
import { DatePicker } from "@/components/date-picker/date-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "../ui/button";
import axios from "axios";
import { useForm } from "react-hook-form";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

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

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

// define the schedule interface
interface Schedule {
    id: number;
    category_id: string;
    color: string;
    title: string;
    description: string;
    date: string;
    start_time: string;
    end_time: string;
}

// props interface for the SchedCard component
interface SchedCardProps {
    daySched: Schedule[];
    updateScheduleList: () => void;
}

export function SchedCard({ daySched, updateScheduleList }: SchedCardProps) {
    const [deleteOpen, setDeleteOpen] = useState<Record<number, boolean>>({});
    const form = useForm();
    const deleteSchedule = async (scheduleId: number): Promise<void> => {
        try {
            const res = await axios.delete("/api/schedule", {
                params: { id: scheduleId },
            });

            // setDeleteOpen(false);
            updateScheduleList();
        } catch (e) {
            console.error("Error deleting schedule:");
        }
    };
    const schedCard = daySched.map((event, id) => {
        return (
            <Card key={id} className={`mt-4 shadow-none ${event.color}`}>
                <CardHeader>
                    <CardDescription className="flex text-slate-600 justify-between">
                        <Label className="underline underline-offset-8">
                            {event.category_id}
                        </Label>
                        <Drawer
                            open={deleteOpen[event.id] || false}
                            onOpenChange={(isOpen) =>
                                setDeleteOpen((prev) => ({
                                    ...prev,
                                    [event.id]: isOpen,
                                }))
                            }
                        >
                            <DrawerTrigger asChild>
                                <Checkbox className="w-6 h-6 rounded-full border-amber-500 data-[state=checked]:bg-amber-500" />
                            </DrawerTrigger>
                            <DrawerContent>
                                <DrawerHeader>
                                    <DrawerTitle>
                                        Mark this schedule ({event.title}) as
                                        done?
                                    </DrawerTitle>
                                    <DrawerDescription>
                                        This action cannot be undone.
                                    </DrawerDescription>
                                </DrawerHeader>
                                <DrawerFooter className="flex flex-row justify-center gap-4">
                                    <Button
                                        onClick={() => deleteSchedule(event.id)}
                                        className="bg-amber-500"
                                    >
                                        Delete
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
                                    <Form {...form}>
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
                                    </Form>
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

    return schedCard;
}
