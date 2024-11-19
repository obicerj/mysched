import { Calendar, CalendarProps } from "@/components/ui/calendar";

export function SummaryCalendar() {
    return (
        <div className="mt-6">
            {/* 
        selected={date}
        onSelect={setDate} */}
            <Calendar
                mode="single"
                className="h-full w-full flex"
                classNames={{
                    months: "flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1",
                    month: "space-y-4 w-full flex flex-col",
                    table: "w-full h-full border-collapse space-y-1",
                    head_row: "",
                    row: "w-full mt-2",
                }}
            />
        </div>
    );
}
