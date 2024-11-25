import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export interface DBSettings {
  host: string

  port: number

  user: string

  password: string

  database: string
}

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
    }
  else
    return {
      host: process.env.DB_HOST!,

      port: parseInt(process.env.DB_PORT!),

      user: process.env.DB_USERNAME!,

      password: process.env.DB_PASSWORD!,

      database: process.env.DB_DATABASE!,
    }
}