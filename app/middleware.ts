import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: Request) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // allow access to public paths
    const publicPaths = ["/auth/signin", "/api/auth", "/"]; // Include other public routes
    const isPublicPath = publicPaths.some((path) => req.url.includes(path));

    if (!token && !isPublicPath) {
        const signInUrl = new URL("/auth/signin", req.url);
        return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
}

// Limit middleware to certain routes
export const config = {
    matcher: ["/api/labels/:path*", "/dashboard/:path*", "/api/schedule/:path*", , "/api/schedule/date/:path*"], // Add routes needing protection
};
