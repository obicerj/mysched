import {
    LightningBoltIcon,
    CardStackPlusIcon,
    StarIcon,
    CalendarIcon,
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

export function FooterNav() {
    const form = useForm();

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
                                    render={(field) => (
                                        <FormItem className="flex flex-col text-left mt-4 pt-4">
                                            <FormLabel>Schedule Date</FormLabel>
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
                                                        setDate={field.onChange}
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
                                                <FormLabel>End time</FormLabel>
                                                <FormControl>
                                                    <TimePicker
                                                        setDate={field.onChange}
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
