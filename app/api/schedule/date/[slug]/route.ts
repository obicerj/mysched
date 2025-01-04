import { NextResponse, NextRequest } from "next/server";
import { GetDBSettings } from "@/lib/utils";
import connectionPool from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getValidatedSession } from "@/lib/session";
import { secureApi } from "@/lib/secureAPI";

// connection parameters
let connectionParams = GetDBSettings();

// export async function GET(request: Request,  { params }: { params: { slug: string } }) {
export async function GET(request: Request, context: { params: { slug: string } }) {
    const { params } = context; // access params from context
    
    // check API authorization
    const unauthorizedResponse = await secureApi(request);
    if (unauthorizedResponse) { 
        return unauthorizedResponse;
    }
    
    try {
        // const { slug } = params;
        // const slug = params?.slug;
        const { slug } = await params; // Await params
        
        // ensure params and slug are available
        if (!slug) {
            return NextResponse.json(
                { error: "Date parameter is required." },
                { status: 400 }
            );
        }

        const userId = await getValidatedSession();
        if (!userId) {
            return NextResponse.json(
                { error: "User session is invalid or unauthorized." },
                { status: 403 }
            );
        }

        // create query to fetch data
        const query = 'SELECT schedules.*, categories.name AS category_name, categories.color AS category_color FROM mysched.schedules JOIN categories ON schedules.category_id = categories.id WHERE DATE(schedules.date) = DATE(?) AND schedules.user_id = ?';
        
        // pass parameters to the sql query
        const [results] = await connectionPool.execute(query, [slug, userId])

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