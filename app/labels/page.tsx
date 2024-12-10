"use client";

import React, { useEffect, useState } from "react";
import { Header } from "@/components/header/header";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { ValueIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { Button } from "@/components/ui/button";

export default function Labels() {
    // define the schema using Zod
    const formSchema = z.object({
        name: z.string().min(1, "Name is required"),
        color: z.string().min(1, "Color is required"),
    });

    // initialize the form with React Hook Form and Zod resolver
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            color: "",
        },
    });

    // submit handler
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        // console.log("Form Data:", data);
        try {
            const res = await axios.post("/api/labels", data);
            form.reset();
            labels();
        } catch (e) {
            console.error(e);
        }
    };

    interface Label {
        id: number;
        name: string;
        color: string;
    }

    const [fetchLabels, setFetchLabels] = useState<Label[]>([]);

    const labels = async () => {
        try {
            const res = await axios.get("/api/labels");
            setFetchLabels(res.data);
        } catch (e) {
            console.error("Error fetching labels", e);
        }
    };

    useEffect(() => {
        labels();
    }, []);

    const deleteLabel = async (labelId: number): Promise<void> => {
        try {
            await axios.delete("/api/labels", {
                params: { id: labelId },
            });

            labels();
        } catch (e) {
            console.error("Error deleting label:");
        }
    };

    return (
        <div className="p-4 text-slate-800 font-[family-name:var(--font-geist-sans)]">
            <Header />
            <h1 className="text-xl font-bold mt-8 mb-4">Create a Label</h1>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    {/* Name Field */}
                    <FormField
                        name="name"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="e.g., Work"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Color Field */}
                    <FormField
                        name="color"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Color</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={(value) =>
                                            field.onChange(value)
                                        }
                                        value={field.value}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a schedule color" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="bg-red-200">
                                                <div className="flex flex-row gap-2">
                                                    <ValueIcon className="mt-0.5 bg-red-200 text-red-200 rounded-full" />
                                                    Red
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="bg-amber-200">
                                                <div className="flex flex-row gap-2">
                                                    <ValueIcon className="mt-0.5 bg-amber-200 text-amber-200 rounded-full" />
                                                    Amber
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="bg-blue-200">
                                                <div className="flex flex-row gap-2">
                                                    <ValueIcon className="mt-0.5 bg-blue-200 text-blue-200 rounded-full" />
                                                    Blue
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="bg-pink-200">
                                                <div className="flex flex-row gap-2">
                                                    <ValueIcon className="mt-0.5 bg-pink-200 text-pink-200 rounded-full" />
                                                    Pink
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="bg-indigo-200">
                                                <div className="flex flex-row gap-2">
                                                    <ValueIcon className="mt-0.5 bg-indigo-200 text-indigo-200 rounded-full" />
                                                    Indigo
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="bg-green-200">
                                                <div className="flex flex-row gap-2">
                                                    <ValueIcon className="mt-0.5 bg-green-200 text-green-200 rounded-full" />
                                                    Green
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white rounded"
                    >
                        Create
                    </Button>
                </form>
            </Form>

            <div className="mt-8 border rounded-xl px-4">
                <Accordion type="single" collapsible className="w-full">
                    {fetchLabels.map((label, id) => {
                        return (
                            <AccordionItem value={`item-${id}`} key={id}>
                                <AccordionTrigger>
                                    {label.name}
                                </AccordionTrigger>
                                <AccordionContent className="flex flex-row justify-between gap-2">
                                    <div className="flex gap-2">
                                        <ValueIcon
                                            className={`mt-0.5 ${label.color} text-amber-200 rounded-full`}
                                        />
                                        {label.color}
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() =>
                                                deleteLabel(label.id)
                                            }
                                            className="bg-red-500 hover:bg-red-400"
                                        >
                                            Delete
                                        </Button>
                                        <Button className="bg-amber-500 hover:bg-amber-400">
                                            Edit
                                        </Button>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        );
                    })}
                </Accordion>
            </div>
        </div>
    );
}

import { AccordionHeader } from "@radix-ui/react-accordion";

export function AccordionDemo() {
    return (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
                <AccordionTrigger>Is it accessible?</AccordionTrigger>
                <AccordionContent>
                    Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger>Is it styled?</AccordionTrigger>
                <AccordionContent>
                    Yes. It comes with default styles that matches the other
                    components&apos; aesthetic.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
                <AccordionTrigger>Is it animated?</AccordionTrigger>
                <AccordionContent>
                    Yes. It's animated by default, but you can disable it if you
                    prefer.
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
