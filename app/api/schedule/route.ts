import { NextResponse, NextRequest } from "next/server";
import { formatDate, formatToZonedTime } from "@/lib/utils";
import connectionPool from "@/lib/db";

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

        const formattedDate = formatDate(date);
       
        const formattedStartTime = formatToZonedTime(start_time);
        
        const formattedEndTime = formatToZonedTime(end_time);
    
        // insert the data into the database
        const query = `INSERT INTO mysched.schedules (title, description, date, start_time, end_time, color, category_id) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await connectionPool.execute(query, [title, description, formattedDate, formattedStartTime, formattedEndTime, color, category_id]);

        // respond with success
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

        // execute delete query
        const query = `DELETE FROM mysched.schedules WHERE id = ?`;
        const [result] = await connectionPool.execute(query, [id]);

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