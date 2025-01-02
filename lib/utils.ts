import { DBSettings } from "@/types"
import { clsx, type ClassValue } from "clsx"
import { format, toZonedTime } from "date-fns-tz"
import { twMerge } from "tailwind-merge"



export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const GetDBSettings = (): DBSettings => {
  const env = process.env.NODE_ENV

  if (env == 'development')
    return {
      host: process.env.DB_HOST!,

      port: parseInt(process.env.DB_PORT!),

      user: process.env.DB_USERNAME!,

      password: process.env.DB_PASSWORD!,

      database: process.env.DB_DATABASE!,

      waitForConnection: true,

      connectionLimit: 10,

      queLimit: 0
    }
  else
    return {
      host: process.env.DB_HOST!,

      port: parseInt(process.env.DB_PORT!),

      user: process.env.DB_USERNAME!,

      password: process.env.DB_PASSWORD!,

      database: process.env.DB_DATABASE!,

      waitForConnection: true,

      connectionLimit: 10,

      queLimit: 0
    }
}

export const timezone = "America/Toronto";

export const formatToZonedTime = (dateTime: Date, tz = timezone) => {
  return format(toZonedTime(dateTime, tz), "yyyy-MM-dd HH:mm:ss", { timeZone: timezone });
}

// Format as YYYY-MM-DD
export const formatDate = (selectedDate: Date) => {
  return new Date(selectedDate).toISOString().split("T")[0];
}


