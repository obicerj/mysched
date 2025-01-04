import "next-auth";

declare module "next-auth" {
    interface Session {
    user: {
      id: number;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export interface User {
    id: number;
    name: string;
    email: string;
    image: string;
    google_id: string;
  };

export interface Schedule {
    id: number;
    category_id: number;
    category_name: string;
    category_color: string;
    title: string;
    description: string;
    date: Date;
    start_time: Date;
    end_time: Date;
}

export interface Label {
    id: number;
    name: string;
    color: string;
}

export interface TimePickerProps {
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
}

export interface SchedCardProps {
    daySched: Schedule[];
    updateScheduleList: () => void;
}

export interface SummaryCalendarProps {
    fetchSelectedDate: (date: string) => void;
}

export interface DBSettings {
    host: string
    port: number
    user: string
    password: string
    database: string,
    waitForConnections: boolean,
    connectionLimit: number,
    queueLimit: number
  }