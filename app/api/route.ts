import { NextResponse, NextRequest } from "next/server";

export async function GET(request: Request) {
    const results = {
        message: 'Hello there',
    }

    return NextResponse.json(results);
}