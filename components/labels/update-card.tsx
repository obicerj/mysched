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

const LabelFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    color: z.string().min(1, "Color is required"),
});

type LabelFormData = z.infer<typeof LabelFormSchema>;

interface UpdateLabelFormProps {
    labelId: number;
    label?: LabelFormData;
    setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    labels: () => void;
}
const UpdateLabelForm: React.FC<UpdateLabelFormProps> = ({
    labelId,
    setDialogOpen,
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

    // update
    const onUpdate = async (data: z.infer<typeof formSchema>) => {
        try {
            const res = await axios.put(`/api/labels/${labelId}`, data);
            console.log({
                title: "Label updated successfully",
                status: "success",
            });
            setDialogOpen(false);
            labels();
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <Dialog>
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
