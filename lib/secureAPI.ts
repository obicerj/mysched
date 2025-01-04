import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function secureApi(request: NextRequest) {
    // extract the cookies manually from the request (for NextRequest)
    const token = await getToken({
      req: request as unknown as any, 
      secret: process.env.NEXTAUTH_SECRET,
    });
  
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    return null; 
  }
