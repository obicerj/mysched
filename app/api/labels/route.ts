import { NextResponse, NextRequest } from "next/server";

import connectionPool from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getValidatedSession } from "@/lib/session";
import { secureApi } from "@/lib/secureAPI";

export async function GET(request: Request, response: Response) {
    const unauthorizedResponse = await secureApi(request);
    if (unauthorizedResponse) { 
        return unauthorizedResponse;
    }
    
    try {
        
        const userId = await getValidatedSession();


        const query = `SELECT * FROM mysched.categories WHERE user_id IS NULL OR user_id = ${userId}`;
        // const query = 'SELECT * FROM mysched.categories';

        const [results] = await connectionPool.execute(query);

        // return results as json api res
        return NextResponse.json(results);
    } catch (e) {
        console.error('ERROR: API - ', e);
        
        return NextResponse.json(
            { error: "An error occurred while fetching the labels." },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    const unauthorizedResponse = await secureApi(request);
    if (unauthorizedResponse) { 
        return unauthorizedResponse;
    }

    try {
        // parse the request body
        const body = await request.json();

        const { name, color } = body;

        // validate data
        if (!name || !color) {
            return NextResponse.json(
                { error: "Missing required fields." },
                { status: 400 }
            );  
        }

        const userId = await getValidatedSession();

        // insert data into the database
        const query = `INSERT INTO mysched.categories (name, color, user_id) VALUES (?, ?, ?)`;

        const [result] = await connectionPool.execute(query, [name, color, userId]);

        // Respond with success
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json(
        { error: "An error occurred while saving the new category." },
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
        const {searchParams} = new URL(request.url);
        const id = searchParams.get("id");

        if(!id) {
            return NextResponse.json(
                {error: "Label ID is required"},
                {status: 400}
            );
        }

        const userId = await getValidatedSession();

        // execute delete query
        const query = `DELETE FROM mysched.categories WHERE id = ? AND user_id = ?`;
        const [result] = await connectionPool.execute(query, [id, userId]);

        if (!result) {
            return NextResponse.json(
                { error: "No label found with the specified ID." },
                { status: 404 }
            );
        }

        console.log(`Label with ID ${id} deleted successfully`);
                return NextResponse.json({ success: true });

    } catch (e) {
        console.error("Error deleting schedule:", e);
        return NextResponse.json(
            { error: "An error occurred while deleting the schedule." },
            { status: 500 }
        );
    }
}