import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";

import { Input } from "@/components/ui/input";
import { TimePicker } from "@/components/time-picker/time-picker";
import { Button } from "../ui/button";

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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { ValueIcon } from "@radix-ui/react-icons";
import { Label } from "@/types";

const scheduleSchema = z.object({
    id: z.number().int(),
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    date: z.preprocess((val) => new Date(val as string), z.date()),
    start_time: z.preprocess((val) => new Date(val as string), z.date()),
    end_time: z.preprocess((val) => new Date(val as string), z.date()),
    category_id: z.number().int(),
});

// Define TypeScript type for form data
type ScheduleFormData = z.infer<typeof scheduleSchema>;

// Define props including the new event prop
interface UpdateScheduleFormProps {
    scheduleId: number;
    event?: ScheduleFormData;
    setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    updateScheduleList: () => void;
}

const UpdateScheduleForm: React.FC<UpdateScheduleFormProps> = ({
    scheduleId,
    event,
    setDialogOpen,
    updateScheduleList,
}) => {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

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

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ScheduleFormData>({
        resolver: zodResolver(scheduleSchema),
        defaultValues: event,
    });

    const form = useForm<ScheduleFormData>({
        resolver: zodResolver(scheduleSchema),
        defaultValues: event,
    });

    const onSubmit: SubmitHandler<ScheduleFormData> = async (data) => {
        setLoading(true);
        try {
            await axios.put(`/api/schedule/${scheduleId}`, data);
            console.log({
                title: "Schedule updated successfully",
                status: "success",
            });

            setDialogOpen(false);
            updateScheduleList();
        } catch (error) {
            console.log(error);
            console.log({
                title: "Failed to update schedule",
                status: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    name="title"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
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
                        <FormItem>
                            <FormLabel>Date</FormLabel>
                            <FormControl>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full text-left"
                                        >
                                            {field.value
                                                ? format(
                                                      new Date(field.value),
                                                      "yyyy-MM-dd"
                                                  )
                                                : "Pick a date"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={new Date(field.value)}
                                            onSelect={(date) =>
                                                field.onChange(date)
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
                                        field.onChange(parseInt(value, 10))
                                    }
                                    value={field.value?.toString()}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a label" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white">
                                        {fetchLabels.map((label, id) => {
                                            return (
                                                <SelectItem
                                                    key={id}
                                                    value={label.id.toString()}
                                                >
                                                    <div className="flex flex-row gap-2">
                                                        <ValueIcon
                                                            className={`mt-0.5 ${label.color} text-red-200 rounded-full`}
                                                        />
                                                        {label.name}
                                                    </div>
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                        </FormItem>
                    )}
                />

                <div className="flex gap-12 pb-8 pt-4">
                    <FormField
                        name="start_time"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem className="text-left mt-4">
                                <FormLabel>Start time</FormLabel>
                                <FormControl>
                                    <TimePicker
                                        setDate={(date) => field.onChange(date)}
                                        date={new Date(field.value)}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="end_time"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem className="text-left mt-4">
                                <FormLabel>End time</FormLabel>
                                <FormControl>
                                    <TimePicker
                                        setDate={(date) => field.onChange(date)}
                                        date={new Date(field.value)}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    className="bg-amber-500 hover:bg-amber-400 w-full"
                >
                    {loading ? "Updating..." : "Update Schedule"}
                </Button>
            </form>
        </Form>
    );
};

export default UpdateScheduleForm;
