import { NextResponse, NextRequest } from "next/server";

import mysql from  'mysql2/promise';

import { GetDBSettings } from "@/lib/utils";

import { format, toZonedTime } from "date-fns-tz";


// connection parameters
let connectionParams = GetDBSettings();

export async function POST(request: Request) {
    try {
        // parse the request body
        const body = await request.json();

        const { title, description, date, start_time, end_time, color, category_id } = body;

        // validate data
        if (!title || !description || !date || !start_time || !end_time || !color || !category_id) {
            return NextResponse.json(
                { error: "Missing required fields." },
                { status: 400 }
            );  
        }

        const formattedDate = new Date(date).toISOString().split("T")[0]; // Format as YYYY-MM-DD
       
        const timezone = "America/Toronto";

        const formattedStartTime = format(toZonedTime(start_time, timezone), "yyyy-MM-dd HH:mm:ss", { timeZone: timezone });
        const formattedEndTime = format(toZonedTime(end_time, timezone), "yyyy-MM-dd HH:mm:ss", { timeZone: timezone });


        // connect to db
        try {
        const db = await mysql.createConnection(connectionParams);
    
        // Insert the data into the database
        const query = `INSERT INTO mysched.schedules (title, description, date, start_time, end_time, color, category_id) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await db.execute(query, [title, description, formattedDate, formattedStartTime, formattedEndTime, color, category_id]);

        // close connection
        await db.end();

        // console.log("Query executed successfully:", result);
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

export async function DELETE(request: NextRequest) {
    try {
        // get ID from request query string
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                {error: "Schedule ID is required."},
                {status: 400}
            );
        }

        // connect to db
        const db = await mysql.createConnection(connectionParams);

        // execute delete query
        const query = `DELETE FROM mysched.schedules WHERE id = ?`;
        const [result] = await db.execute(query, [id]);

        // close db connection
        await db.end();

        if (!result) {
            return NextResponse.json(
                { error: "No schedule found with the specified ID." },
                { status: 404 }
            );
        }

        console.log(`Schedule with ID ${id} deleted successfully`);
        return NextResponse.json({ success: true });
    } catch (e) {
        console.error("Error deleting schedule:", e);
        return NextResponse.json(
            { error: "An error occurred while deleting the schedule." },
            { status: 500 }
        );
    }
}