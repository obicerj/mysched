export interface Schedule {
    id: number;
    category_id: number;
    category_name: string;
    color: string;
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
    waitForConnection: boolean,
    connectionLimit: number
  }