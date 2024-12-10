"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    LightningBoltIcon,
    CardStackPlusIcon,
    StarIcon,
    CalendarIcon,
    ValueIcon,
} from "@radix-ui/react-icons";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { TimePicker } from "@/components/time-picker/time-picker";
import { DatePicker } from "@/components/date-picker/date-picker";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { Select, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { SelectContent } from "@radix-ui/react-select";

export function FooterNav({ listUpdated }: { listUpdated: () => void }) {
    // manage dialog open/close state
    const [dialogOpen, setDialogOpen] = useState(false);

    const [responseMessage, setResponseMessage] = useState("");

    const formSchema = z.object({
        title: z.string().min(1, "Title is required"),
        category_id: z.number().int(),
        color: z.string(),
        description: z.string(),
        date: z.date(),
        start_time: z.date(),
        end_time: z.date(),
    });

    // set default values
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            category_id: undefined,
            color: "bg-red-100",
            description: "",
            date: undefined,
            start_time: undefined,
            end_time: undefined,
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            // send data to the API
            const response = await axios.post("/api/schedule", values);
            // setResponseMessage("Schedule added successfully!");

            // close dialog and reset the form
            setDialogOpen(false);
            form.reset();

            // notify parent to update the list
            // trigger list refresh
            listUpdated();
        } catch (error: any) {
            // handle error
            setResponseMessage(
                error.response?.data?.error || "An error occurred."
            );
        }
    };

    interface Label {
        id: number;
        name: string;
        color: string;
    }
    const [fetchLabels, setFetchLabels] = useState<Label[]>([]);

    useEffect(() => {
        const labels = async () => {
            try {
                const res = await axios.get("/api/labels");
                setFetchLabels(res.data);
            } catch (e) {
                console.error("Error fetching labels", e);
            }
        };
        labels();
    }, []);

    return (
        <nav className="flex mt-12 ">
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

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger className="flex items-center gap-2">
                        <CardStackPlusIcon />
                        <span className="hover:underline hover:underline-offset-4">
                            Create Schedule
                        </span>
                    </DialogTrigger>
                    <DialogContent className="text-left">
                        <DialogHeader>
                            <DialogTitle>Create Schedule</DialogTitle>
                            <DialogDescription></DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <FormField
                                    name="title"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="text-left mt-4">
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
                                            <FormLabel>Description</FormLabel>
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
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col text-left mt-4 pt-4">
                                            <FormLabel>Schedule Date</FormLabel>
                                            <FormControl>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className="w-full text-left"
                                                        >
                                                            {field.value
                                                                ? format(
                                                                      field.value,
                                                                      "yyyy-MM-dd"
                                                                  )
                                                                : "Pick a date"}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0">
                                                        <Calendar
                                                            mode="single"
                                                            selected={
                                                                field.value
                                                            }
                                                            onSelect={(date) =>
                                                                field.onChange(
                                                                    date
                                                                )
                                                            }
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    name="category_id"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="mt-4">
                                            <FormLabel>Label</FormLabel>
                                            <FormControl>
                                                <Select
                                                    onValueChange={(value) =>
                                                        field.onChange(
                                                            parseInt(value, 10)
                                                        )
                                                    }
                                                    value={field.value?.toString()}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a label" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white">
                                                        {fetchLabels.map(
                                                            (label, id) => {
                                                                return (
                                                                    <SelectItem
                                                                        key={id}
                                                                        value={label.id.toString()}
                                                                    >
                                                                        <div className="flex flex-row gap-2">
                                                                            <ValueIcon
                                                                                className={`mt-0.5 ${label.color} text-red-200 rounded-full`}
                                                                            />
                                                                            {
                                                                                label.name
                                                                            }
                                                                        </div>
                                                                    </SelectItem>
                                                                );
                                                            }
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <div className="flex gap-12 pb-8 pt-4">
                                    <FormField
                                        name="start_time"
                                        render={({ field }) => (
                                            <FormItem className="text-left mt-4">
                                                <FormLabel>
                                                    Start time
                                                </FormLabel>
                                                <FormControl>
                                                    <TimePicker
                                                        date={
                                                            field.value ||
                                                            undefined
                                                        }
                                                        setDate={(
                                                            selectedTime
                                                        ) => {
                                                            field.onChange(
                                                                selectedTime
                                                            ); // pass date object
                                                        }}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        name="end_time"
                                        render={({ field }) => (
                                            <FormItem className="text-left mt-4">
                                                <FormLabel>End time</FormLabel>
                                                <FormControl>
                                                    <TimePicker
                                                        date={
                                                            field.value ||
                                                            undefined
                                                        }
                                                        setDate={(
                                                            selectedTime
                                                        ) => {
                                                            field.onChange(
                                                                selectedTime
                                                            ); // pass date object
                                                        }}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="mt-4 bg-amber-500 hover:bg-amber-400 w-full"
                                >
                                    Create
                                </Button>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href="/labels"
                    rel="noopener noreferrer"
                >
                    <StarIcon />
                    Labels
                </a>
            </div>
        </nav>
    );
}
