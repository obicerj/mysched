"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

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
import {
    CardStackIcon,
    LightningBoltIcon,
    PlusIcon,
    ValueIcon,
} from "@radix-ui/react-icons";
import axios from "axios";
import { Button } from "@/components/ui/button";
import UpdateLabelForm from "@/components/labels/update-card";
import { DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
} from "@/components/ui/dialog";
import { Label } from "@/types";
import Providers from "../providers";
import { Header } from "@/components/header/header";

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

    const { register, handleSubmit } = useForm<z.infer<typeof formSchema>>({
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
            setDialogOpen(false);
            form.reset();
            labels();
        } catch (e) {
            console.log(e);
        }
    };

    const [fetchLabels, setFetchLabels] = useState<Label[]>([]);

    const labels = async () => {
        try {
            const res = await axios.get("/api/labels");
            setFetchLabels(res.data);
        } catch (e) {
            console.log("Error fetching labels", e);
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
            console.log("Error deleting label:");
        }
    };

    // manage dialog open/close state
    const [dialogOpen, setDialogOpen] = useState(false);

    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return; // Do not redirect if session is still loading
        if (!session) {
            router.push("/"); // Redirect if not logged in
        }
    }, [session, status, router]);

    if (status === "loading") {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-lg text-gray-600 animate-pulse">
                    Loading...
                </p>
            </div>
        );
    }

    return (
        <Providers>
            <div className="p-4 mb-24 text-slate-800 font-[family-name:var(--font-geist-sans)]">
                <Header />

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
                        <DialogTrigger className="flex items-center gap-2 hover:underline hover:underline-offset-4">
                            <PlusIcon /> <span>Add Label</span>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Label</DialogTitle>
                                <DialogDescription></DialogDescription>
                            </DialogHeader>
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
                                                        onValueChange={(
                                                            value
                                                        ) =>
                                                            field.onChange(
                                                                value
                                                            )
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
                                        className="mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white rounded w-full"
                                    >
                                        Create
                                    </Button>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="flex flex-col justify-center items-center h-full">
                    <h1 className="text-xl font-bold mt-8 mb-4">
                        Schedule Labels
                    </h1>
                    <div className="w-full flex justify-center">
                        <Accordion
                            type="single"
                            collapsible
                            className="border rounded-xl px-4 w-2/3"
                        >
                            {fetchLabels.map((label, id) => {
                                return (
                                    <AccordionItem
                                        value={`item-${id}`}
                                        key={id}
                                    >
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
                                                {session?.user.id ===
                                                    label.user_id && (
                                                    <>
                                                        <Button
                                                            onClick={() =>
                                                                deleteLabel(
                                                                    label.id
                                                                )
                                                            }
                                                            className="bg-red-500 hover:bg-red-400"
                                                        >
                                                            Delete
                                                        </Button>

                                                        <UpdateLabelForm
                                                            key={label.id}
                                                            labelId={label.id}
                                                            labels={labels}
                                                            label={label}
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                );
                            })}
                        </Accordion>
                    </div>
                </div>
            </div>
        </Providers>
    );
}
