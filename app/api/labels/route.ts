import { NextResponse, NextRequest } from "next/server";

import mysql from  'mysql2/promise';

import { GetDBSettings, DBSettings } from "@/lib/utils";

// connection parameters
let connectionParams = GetDBSettings();

export async function GET(request: Request) {
    try {
        // connect to db
        const db = await mysql.createConnection(connectionParams);

        const query = 'SELECT * FROM mysched.categories';

        const [results] = await db.execute(query);

        // close connection
        await db.end();

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
        console.log("Step 1: Parsing request body");
        const body = await request.json();

        console.log("Parsed body:", body);
        const { name, color } = body;

        // validate data
        console.log("Step 2: Validating input");
        if (!name || !color) {
            return NextResponse.json(
                { error: "Missing required fields." },
                { status: 400 }
            );  
        }

        // connect to db
        try {
        console.log("Step 3: Connecting to the database");
        const db = await mysql.createConnection(connectionParams);
        console.log("Database connection successful");
    
        // insert data into the database
        console.log("Step 4: Executing the query");
        const query = `INSERT INTO mysched.categories (name, color) VALUES (?, ?)`;
        const [result] = await db.execute(query, [name, color]);

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
        { error: "An error occurred while saving the new category." },
        { status: 500 }
        )
    }
} 