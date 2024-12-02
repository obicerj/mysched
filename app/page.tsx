"use client";

import axios from "axios";

import { format, isToday } from "date-fns";

import React, { useEffect, useState } from "react";
import { Header } from "@/components/header/header";
import { Summary } from "@/components/sched-summary/summary";
import { SummaryCalendar } from "@/components/sched-summary/summary-calendar";
import { FooterNav } from "@/components/nav/footer-nav";
import { SchedCard } from "@/components/sched-card/sched-card";

export default function Home() {
    const name = "Jestoni";

    const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const today = new Date();
    const dayName = days[today.getDay()];
    const monthName = months[today.getMonth()];
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    interface Schedule {
        id: number;
        category_id: string;
        category_name: string;
        color: string;
        title: string;
        description: string;
        date: string;
        start_time: string;
        end_time: string;
    }

    const [mySchedule, setMySchedule] = useState<Schedule[]>([]);

    const [fetchDate, setFetchDate] = useState<string>("");

    const getDate = (selectedDate: string) => {
        setFetchDate(selectedDate);
    };

    // update schedule list after create form submission
    const updateScheduleList = async () => {
        const pickDate = fetchDate || format(new Date(), "yyyy-MM-dd");

        try {
            const res = await axios.get(`/api/schedule/date/${pickDate}`);
            setMySchedule(res.data);
        } catch (e) {
            console.error("Error updating schedules:", e);
        }
    };

    useEffect(() => {
        const pickDate = fetchDate
            ? fetchDate
            : format(new Date(), "yyyy-MM-dd");

        const fetchSchedules = async () => {
            try {
                const res = await axios.get(`/api/schedule/date/${pickDate}`);
                setMySchedule(res.data);
            } catch (e) {
                console.error("Error fetching schedules:", e);
            }
        };
        fetchSchedules();
    }, [fetchDate]);

    const sortedSched = mySchedule.sort(
        (a, b) =>
            new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    );

    const totalSchedToday = mySchedule.length;

    // const [deleteOpen, setDeleteOpen] = useState<Record<number, boolean>>({});

    const deleteSchedule = async (scheduleId: number) => {
        try {
            const res = await axios.delete("/api/schedule", {
                params: { id: scheduleId },
            });

            // setDeleteOpen(false);
            updateScheduleList();
        } catch (e) {
            console.error("Error deleting schedule:");
        }
    };

    return (
        <div className="p-4 text-slate-800 font-[family-name:var(--font-geist-sans)]">
            <main>
                <Header />
                <Summary name={name} totalSchedToday={totalSchedToday} />
                <SummaryCalendar fetchSelectedDate={getDate} />
                {mySchedule.length ? (
                    <SchedCard
                        daySched={sortedSched}
                        updateScheduleList={updateScheduleList}
                    />
                ) : (
                    <p className="text-center mt-14 mb-32 text-3xl text-slate-300 font-bold">
                        Your schedule is empty
                    </p>
                )}
            </main>

            <FooterNav listUpdated={updateScheduleList} />
        </div>
    );
}
