import { NextResponse, NextRequest } from "next/server";
import { formatDate, formatToZonedTime } from "@/lib/utils";
import connectionPool from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getValidatedSession } from "@/lib/session";
import { secureApi } from "@/lib/secureAPI";

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if(!session || !session.user?.id) {
            return new Response(JSON.stringify({ error: "Unauthorized" }));
        }
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
        const query = `INSERT INTO mysched.schedules (title, description, date, start_time, end_time, color, category_id, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await connectionPool.execute(query, [title, description, formattedDate, formattedStartTime, formattedEndTime, color, category_id, session.user.id]);

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
    const unauthorizedResponse = await secureApi(request);
    if (unauthorizedResponse) { 
        return unauthorizedResponse;
    }
    
    try {
        // get ID from request query string
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        const userId = await getValidatedSession();

        if (!id) {
            return NextResponse.json(
                {error: "Schedule ID is required."},
                {status: 400}
            );
        }

        // execute delete query
        const query = `DELETE FROM mysched.schedules WHERE id = ? AND schedules.user_id = ?`;
        const [result] = await connectionPool.execute(query, [id, userId]);

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