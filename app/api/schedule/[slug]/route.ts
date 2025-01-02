import { NextResponse, NextRequest } from "next/server";

import { formatToZonedTime } from "@/lib/utils";

import { z } from "zod";
import connectionPool from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getValidatedSession } from "@/lib/session";


export async function GET(request: Request,  { params }: { params: { slug: string } }) {
  // sched id
  const slug = params.slug 

  const userId = getValidatedSession();
  
  try {

    // create query to fetch data
    const query = 'SELECT schedules.*, categories.name AS category_name FROM mysched.schedules JOIN categories ON schedules.category_id = categories.id WHERE schedules.id = ? AND schedules.user_id = ?';
    
    // pass parameters to the sql query
    const [results] = await connectionPool.execute(query, [slug, userId])


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
        const parsedId = parseInt(slug, 10);

        
        const userId = await getValidatedSession();
        

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
        
        const rawBody = await req.text();
        // console.log("Raw body text:", rawBody);

        const body = JSON.parse(rawBody);
        // console.log("Parsed body:", body);

        const validatedData = scheduleSchema.parse({ ...body, id: parsedId });
        // console.log("Validated data:", validatedData);


        const { title, description, date, start_time, end_time, category_id } = validatedData;
        
        const formattedStartTime = formatToZonedTime(start_time);
        
        const formattedEndTime = formatToZonedTime(end_time);

        await connectionPool.execute(
            `UPDATE schedules SET title = ?, description = ?, date = ?, start_time = ?, end_time = ?, category_id = ? WHERE id = ? AND user_id = ?`,
            [title, description, date, formattedStartTime, formattedEndTime, category_id, parsedId, userId]
          );

        // create query to fetch data
        const query = 'SELECT schedules.*, categories.name AS category_name FROM mysched.schedules JOIN categories ON schedules.category_id = categories.id WHERE schedules.id = ? AND schedules.user_id = ?';
        
        // pass parameters to the sql query
        const [results] = await connectionPool.execute(query, [parsedId, userId])

        console.log({ message: "Schedule updated successfully" });

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