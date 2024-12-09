import { NextResponse, NextRequest } from "next/server";

import mysql from  'mysql2/promise';

import { GetDBSettings, DBSettings } from "@/lib/utils";

// connection parameters
let connectionParams = GetDBSettings();

export async function GET(request: Request,  { params }: { params: { slug: string } }) {
    
    try {
        const { slug } = await params;

        // Ensure params and slug are available
        if (!slug) {
            return NextResponse.json(
                { error: "Date parameter is required." },
                { status: 400 }
            );
        }

        // connect to db
        const db = await mysql.createConnection(connectionParams);

        // create query to fetch data
        const query = 'SELECT schedules.*, categories.name AS category_name, categories.color AS color FROM mysched.schedules JOIN categories ON schedules.category_id = categories.id WHERE DATE(date) = DATE(?)';
        
        // pass parameters to the sql query
        const [results] = await db.execute(query, [slug])

        // close connection
        await db.end();

        // return results as json api response
        return NextResponse.json(results)

    } catch (e) {
        console.error('ERROR: API - ', e);
        
        return NextResponse.json(
            { error: "An error occurred while fetching the schedule." },
            { status: 500 }
        );
    }
}