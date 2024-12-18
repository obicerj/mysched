import { NextResponse, NextRequest } from "next/server";

import { z } from "zod";
import connectionPool from "@/lib/db";

export async function GET(request: Request, {params}: {params: {slug: number}}) {
    try {
        const {slug} = await params;

        if(!slug) {
            return NextResponse.json(
                { error: "Label ID parameter is required." },
                { status: 400 }
            );
        }

        // create query to fetch data
        const query = 'SELECT * FROM categories WHERE id = ?';
        
        // pass parameters to the sql query
        const [results] = await connectionPool.execute(query, [slug])

        // return results as json api response
        return NextResponse.json(results)
    } catch (e) {
        console.error('ERROR: API - ', e);
        
        return NextResponse.json(
            { error: "An error occurred while fetching the Label." },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request, context: {params: {slug: string}}) {
    const formSchema = z.object({
        name: z.string().min(1, "Name is required"),
        color: z.string().min(1, "Color is required"),
    });

    try {
        const { slug } = context.params;
        const parsedId = parseInt(slug, 10);

        if (isNaN(parsedId)) {
            return NextResponse.json(
                { error: "ID parameter is required." },
                { status: 400 }
            );
        }

        // check content type
        if (request.headers.get("content-type") !== "application/json") {
            return NextResponse.json(
              { error: "Content-Type must be application/json." },
              { status: 400 }
            );
          }

        const rawBody = await request.text();
        console.log("Raw body text:", rawBody);

        const body = JSON.parse(rawBody);
        console.log("Parsed body:", body);

        const validatedData = formSchema.parse({...body, id: parsedId})
        const {name, color} = validatedData;

        await connectionPool.execute(
            `UPDATE categories SET name = ?, color = ? WHERE id = ?`,
            [name, color, parsedId]
          );


        const query = 'SELECT * FROM categories WHERE id = ?';

        const [results] = await connectionPool.execute(query, [parsedId])

        // return results as json api response
        return NextResponse.json({ message: "Label updated successfully", label: results });


    } catch (e) {
        return NextResponse.json(
            { error: "An error occurred while updating the label." },
            { status: 500 }
        );
    }
}