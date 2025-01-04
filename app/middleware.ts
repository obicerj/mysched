import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    // retrieve the token for authenticated session
    const token = await getToken({ req: request as any, secret: process.env.NEXTAUTH_SECRET });

    // public paths that do not require authentication
    const publicPaths = ["/auth/signin", "/api/auth", "/"];
    const isPublicPath = publicPaths.some((path) => request.nextUrl.pathname.startsWith(path));

    // redirect to /auth/signin if user is not authenticated and accessing a protected route
    if (!token && !isPublicPath) {
        const signInUrl = new URL("/auth/signin", request.url);
        return NextResponse.redirect(signInUrl);
    }

    // allow the request to proceed for authenticated users or public paths
    return NextResponse.next();
}

// limit middleware to specific routes
export const config = {
    matcher: [
        "/api/labels/:path*",
        "/dashboard/:path*",
        "/api/schedule/:path*",
        "/api/schedule/date/:path*",
    ], // define routes that require authentication
};
