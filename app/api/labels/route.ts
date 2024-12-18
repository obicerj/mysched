import { NextResponse, NextRequest } from "next/server";

import mysql from  'mysql2/promise';

import { GetDBSettings } from "@/lib/utils";
import connectionPool from "@/lib/db";

// connection parameters
let connectionParams = GetDBSettings();

export async function GET(request: Request) {
    try {
        const query = 'SELECT * FROM mysched.categories';
        
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
    
        // insert data into the database
        const query = `INSERT INTO mysched.categories (name, color) VALUES (?, ?)`;

        const [result] = await connectionPool.execute(query, [name, color]);

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
    try {
        const {searchParams} = new URL(request.url);
        const id = searchParams.get("id");

        if(!id) {
            return NextResponse.json(
                {error: "Label ID is required"},
                {status: 400}
            );
        }

        // execute delete query
        const query = `DELETE FROM mysched.categories WHERE id = ?`;
        const [result] = await connectionPool.execute(query, [id]);

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