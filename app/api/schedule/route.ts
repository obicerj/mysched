import { NextResponse, NextRequest } from "next/server";

import mysql from  'mysql2/promise';

import { GetDBSettings, DBSettings } from "@/lib/utils";

// connection parameters
let connectionParams = GetDBSettings();

export async function POST(request: Request) {
    try {
        // parse the request body
        console.log("Step 1: Parsing request body");
        const body = await request.json();

        console.log("Parsed body:", body);
        const { title, description, date, start_time, end_time, color, label } = body;

        // validate data
        console.log("Step 2: Validating input");
        if (!title || !description || !date || !start_time || !end_time || !color || !label) {
            return NextResponse.json(
                { error: "Missing required fields." },
                { status: 400 }
            );  
        }

        console.log("Formatting dates");
        const formattedDate = new Date(date).toISOString().split("T")[0]; // Format as YYYY-MM-DD
        const formattedStartTime = new Date(start_time)
            .toISOString()
            .replace("T", " ")
            .split(".")[0]; // Format as YYYY-MM-DD HH:MM:SS
        const formattedEndTime = new Date(end_time)
            .toISOString()
            .replace("T", " ")
            .split(".")[0]; // Format as YYYY-MM-DD HH:MM:SS



        // connect to db
        try {
        console.log("Step 3: Connecting to the database");
        const db = await mysql.createConnection(connectionParams);
        console.log("Database connection successful");
    
        // Insert the data into the database
        console.log("Step 4: Executing the query");
        const query = `INSERT INTO mysched.schedules (title, description, date, start_time, end_time, color, label) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await db.execute(query, [title, description, formattedDate, formattedStartTime, formattedEndTime, color, label]);

        // close connection
        await db.end();

        console.log("Query executed successfully:", result);
    } catch (err) {
        console.error("Database connection error:", err);
    }
        // Respond with success
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json(
        { error: "An error occurred while saving the schedule." },
        { status: 500 }
        )
    }
} 