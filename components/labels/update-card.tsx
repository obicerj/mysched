import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { AccordionHeader } from "@radix-ui/react-accordion";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { z } from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { ValueIcon } from "@radix-ui/react-icons";
import { useState } from "react";

const LabelFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    color: z.string().min(1, "Color is required"),
});

type LabelFormData = z.infer<typeof LabelFormSchema>;

interface UpdateLabelFormProps {
    labelId: number;
    label?: LabelFormData;
    labels: () => void;
}
const UpdateLabelForm: React.FC<UpdateLabelFormProps> = ({
    labelId,
    labels,
    label,
}) => {
    // define the schema using Zod
    const formSchema = z.object({
        name: z.string().min(1, "Name is required"),
        color: z.string().min(1, "Color is required"),
    });

    // initialize the form with React Hook Form and Zod resolver
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: label,
    });

    const { register, handleSubmit } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: label,
    });

    // manage dialog open/close state
    const [dialogOpen, setDialogOpen] = useState<Record<number, boolean>>({});

    // update
    const onUpdate = async (data: z.infer<typeof formSchema>) => {
        try {
            const res = await axios.put(`/api/labels/${labelId}`, data);
            console.log({
                title: "Label updated successfully",
                status: "success",
            });

            setDialogOpen((prev) => ({
                ...prev,
                [labelId]: false,
            }));

            labels();
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <Dialog
            open={dialogOpen[labelId] || false}
            onOpenChange={(isOpen) =>
                setDialogOpen((prev) => ({
                    ...prev,
                    [labelId]: isOpen,
                }))
            }
        >
            <DialogTrigger className="bg-amber-500 hover:bg-amber-400 px-6 rounded-md font-medium text-white">
                Edit
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onUpdate)}
                        className="space-y-4"
                    >
                        <FormField
                            name="name"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g Pickup day shift"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

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

                        <Button
                            type="submit"
                            className="bg-amber-500 hover:bg-amber-400 w-full"
                        >
                            Update
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateLabelForm;
