import { NextResponse, NextRequest } from "next/server";

import mysql from  'mysql2/promise';

import { GetDBSettings, DBSettings } from "@/lib/utils";

import { z } from "zod";
import { use } from "react";

// import { scheduleSchema } from "@/schemas/scheduleSchema";

// connection parameters
let connectionParams = GetDBSettings();

export async function GET(request: Request,  { params }: { params: { slug: string } }) {
  // sched id
  const slug = params.slug 
  
  try {
    // const { slug } = await params;

    // connect to db
    const db = await mysql.createConnection(connectionParams);

    // Ensure params and slug are available
    // if (!slug) {
    //     return NextResponse.json(
    //         { error: "ID parameter is required." },
    //         { status: 400 }
    //     );
    // }

    // connect to db
    // const db = await mysql.createConnection(connectionParams);

    // create query to fetch data
    const query = 'SELECT schedules.*, categories.name AS category_name FROM mysched.schedules JOIN categories ON schedules.category_id = categories.id WHERE schedules.id = ?';
    
    // pass parameters to the sql query
    const [results] = await db.execute(query, [slug])

    // close connection
    // await db.end();
    db.end();


    // return results as json api response
    return NextResponse.json(results)

} catch (e) {
    console.error('ERROR: API - ', e);
    
    const response = {
      error: (e as Error).message,

      returnedStatus: 200,
    }

    return NextResponse.json(response, { status: 200 })
}
}

export async function PUT(req: NextRequest,  context: { params: {slug: string} }) {
    
    const scheduleSchema = z.object({
        id: z.number().int(),
        title: z.string(),
        description: z.string(),
        date: z.preprocess((val) => new Date(val as string), z.date()),
        start_time: z.preprocess((val) => new Date(val as string), z.date()),
        end_time: z.preprocess((val) => new Date(val as string), z.date()),
        category_id: z.number().int(),
      });
    
    try {
        // const { id } = params;
        const { slug } = context.params;
        // const slug = (await params).slug;
        const parsedId = parseInt(slug, 10);
        

        // Ensure params and slug are available
        if (isNaN(parsedId)) {
            return NextResponse.json(
                { error: "ID parameter is required." },
                { status: 400 }
            );
        }

        // check content type
        if (req.headers.get("content-type") !== "application/json") {
        return NextResponse.json(
          { error: "Content-Type must be application/json." },
          { status: 400 }
        );
      }

    //   console.log("Request headers:", req.headers);
        const rawBody = await req.text();
        console.log("Raw body text:", rawBody);

        const body = JSON.parse(rawBody);
        console.log("Parsed body:", body);


        // let body;
        // try {
        //     body = await req.json();
        //   } catch (error) {
        //     return NextResponse.json(
        //       { error: "Invalid JSON payload" },
        //       { status: 400 }
        //     );
        //   }

        const validatedData = scheduleSchema.parse({ ...body, id: parsedId });
        console.log("Validated data:", validatedData);


        const { title, description, date, start_time, end_time, category_id } = validatedData;

        const formattedStartTime = new Date(start_time).toISOString().slice(0, 19).replace("T", " ");
        const formattedEndTime = new Date(end_time).toISOString().slice(0, 19).replace("T", " ");


        // connect to db
        const db = await mysql.createConnection(connectionParams);

        await db.execute(
            `UPDATE schedules SET title = ?, description = ?, date = ?, start_time = ?, end_time = ?, category_id = ? WHERE id = ?`,
            [title, description, date, formattedStartTime, formattedEndTime, category_id, parsedId]
          );

        // create query to fetch data
        // const query = 'SELECT schedules.*, categories.name AS category_name FROM mysched.schedules JOIN categories ON schedules.category_id = categories.id WHERE DATE(date) = DATE(?)';
        const query = 'SELECT schedules.*, categories.name AS category_name FROM mysched.schedules JOIN categories ON schedules.category_id = categories.id WHERE schedules.id = ?';
        
        // pass parameters to the sql query
        const [results] = await db.execute(query, [parsedId])


        console.log({ message: "Schedule updated successfully" });

        // close connection
        await db.end();

        // return results as json api response
        return NextResponse.json({ message: "Schedule updated successfully", schedule: results });

    } catch (e) {
        console.error('ERROR: API - ', e);
        
        return NextResponse.json(
            { error: "An error occurred while updating the schedule." },
            { status: 500 }
        );
    }


}