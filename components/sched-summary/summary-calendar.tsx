import { Calendar, CalendarProps } from "@/components/ui/calendar";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";

interface SummaryCalendarProps {
    fetchSelectedDate: (date: string) => void;
}

export function SummaryCalendar({ fetchSelectedDate }: SummaryCalendarProps) {
    const [date, setDate] = React.useState<Date | undefined>(new Date());

    // format(date, "yyyy-MM-dd HH:mm:ss")
    // fetchSelectedDate(format(date, "yyyy-MM-dd HH:mm:ss"));

    useEffect(() => {
        if (date) {
            fetchSelectedDate(format(date, "yyyy-MM-dd HH:mm:ss"));
        }
    }, [date, fetchSelectedDate]);

    // console.log(date);

    return (
        <div className="mt-6">
            <Calendar
                selected={date}
                onSelect={setDate}
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
