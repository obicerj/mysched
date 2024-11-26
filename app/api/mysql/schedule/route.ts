import { NextResponse, NextRequest } from "next/server";

import mysql from  'mysql2/promise';

import { GetDBSettings, DBSettings } from "@/lib/utils";

// connection parameters
let connectionParams = GetDBSettings();

export async function GET(request: Request) {
    try {
        // connect to db
        const db = await mysql.createConnection(connectionParams);

        // create query to fetch data
        let get_exp_query = '';

        get_exp_query = `SELECT * FROM mysched.schedules WHERE DATE(date) = CURRENT_DATE`;

        // pass parameters to the sql query

        let values: any[] = [];

        const [results] = await db.execute(get_exp_query, values);

        // close connection

        db.end();

        // return results as json api response
        return NextResponse.json(results)

    } catch (error) {
        console.log('ERROR: API - ', (error as Error).message)
        
        const response = {
            error: (error as Error).message,
      
            returnedStatus: 200,
          }
      
          return NextResponse.json(response, { status: 200 })
    }
}