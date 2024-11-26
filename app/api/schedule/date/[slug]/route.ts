import { NextResponse, NextRequest } from "next/server";

import mysql from  'mysql2/promise';

import { GetDBSettings, DBSettings } from "@/lib/utils";

// connection parameters
let connectionParams = GetDBSettings();

export async function GET(request: Request,  { params }: { params: { slug: string } }) {
    
    // sched id
    // const {params} = context;
    
    try {
        // Ensure params and slug are available
        if (!params?.slug) {
            return NextResponse.json(
                { error: "Slug parameter is required." },
                { status: 400 }
            );
        }
        const slug = params.slug;

        // connect to db
        const db = await mysql.createConnection(connectionParams);

        // create query to fetch data
        const query = 'SELECT * FROM mysched.schedules WHERE DATE(date) = DATE(?)';
        

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