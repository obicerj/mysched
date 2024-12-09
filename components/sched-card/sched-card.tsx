import React, { useEffect, useState } from "react";
import { format, isToday } from "date-fns";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TimePicker } from "@/components/time-picker/time-picker";
import { DatePicker } from "@/components/date-picker/date-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "../ui/button";

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
import { Description } from "@radix-ui/react-dialog";
import UpdateScheduleForm from "./update-card";

// define the schedule interface
interface Schedule {
    id: number;
    category_id: number;
    category_name: string;
    color: string;
    title: string;
    description: string;
    date: Date;
    start_time: Date;
    end_time: Date;
}

// props interface for the SchedCard component
interface SchedCardProps {
    daySched: Schedule[];
    updateScheduleList: () => void;
}

export function SchedCard({ daySched, updateScheduleList }: SchedCardProps) {
    const [deleteOpen, setDeleteOpen] = useState<Record<number, boolean>>({});
    const [loading, setLoading] = useState(false);
    // manage dialog open/close state
    const [dialogOpen, setDialogOpen] = useState<Record<number, boolean>>({});

    // Define schedule schema using Zod
    const scheduleSchema = z.object({
        id: z.number().int(),
        title: z.string().min(1, "Title is required"),
        description: z.string().min(1, "Description is required"),
        date: z.preprocess((val) => new Date(val as string), z.date()),
        start_time: z.preprocess((val) => new Date(val as string), z.date()),
        end_time: z.preprocess((val) => new Date(val as string), z.date()),
        category_id: z.number().int(),
        color: z.string(),
    });

    const form = useForm<z.infer<typeof scheduleSchema>>({
        resolver: zodResolver(scheduleSchema),
    });

    const deleteSchedule = async (scheduleId: number): Promise<void> => {
        try {
            await axios.delete("/api/schedule", {
                params: { id: scheduleId },
            });

            // setDeleteOpen(false);
            updateScheduleList();
        } catch (e) {
            console.error("Error deleting schedule:");
        }
    };

    // Handle edit to prefill form data
    // const handleEdit = (event: Schedule) => {
    //     console.log("Prefilling form with event data:", event);
    //     form.setValue("id", event.id);
    //     form.setValue("title", event.title);
    //     form.setValue("description", event.description);
    //     form.setValue("category_id", event.category_id);
    //     form.setValue("color", event.color);
    //     form.setValue("date", new Date(event.date));
    //     form.setValue("start_time", new Date(event.start_time));
    //     form.setValue("end_time", new Date(event.end_time));
    // };

    const { errors } = form.formState;

    return daySched.map((event, id) => (
        <Card key={id} className={`mt-4 shadow-none ${event.color}`}>
            <CardHeader>
                <CardDescription className="flex text-slate-600 justify-between">
                    <Label className="underline underline-offset-8">
                        {event.category_name}
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
                                    Mark this schedule ({event.title}) as done?
                                </DrawerTitle>
                                <DrawerDescription>
                                    This action cannot be undone.
                                </DrawerDescription>
                            </DrawerHeader>
                            <DrawerFooter className="flex flex-row justify-center gap-4">
                                <Button
                                    onClick={() => deleteSchedule(event.id)}
                                    className="bg-amber-500 hover:bg-amber-400"
                                >
                                    Delete
                                </Button>
                                <DrawerClose>Cancel</DrawerClose>
                            </DrawerFooter>
                        </DrawerContent>
                    </Drawer>
                </CardDescription>

                <CardTitle className="font-normal text-xl">
                    <Dialog
                        open={dialogOpen[event.id] || false}
                        onOpenChange={(isOpen) =>
                            setDialogOpen((prev) => ({
                                ...prev,
                                [event.id]: isOpen,
                            }))
                        }
                    >
                        {/* onClick={() => handleEdit(event)} */}
                        <DialogTrigger>{event.title}</DialogTrigger>

                        <DialogContent className="text-left">
                            <DialogHeader>
                                <DialogTitle>Update {event.title}</DialogTitle>
                                <DialogDescription>
                                    {errors.title && (
                                        <p className="error">
                                            {errors.title.message}
                                        </p>
                                    )}
                                </DialogDescription>
                            </DialogHeader>
                            <UpdateScheduleForm
                                key={event.id}
                                scheduleId={event.id}
                                event={event}
                                // setDialogOpen={setDialogOpen}
                                setDialogOpen={(isOpen) =>
                                    setDialogOpen((prev) => ({
                                        ...prev,
                                        [event.id]: isOpen as boolean,
                                    }))
                                }
                                updateScheduleList={updateScheduleList}
                            />
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
    ));
}
