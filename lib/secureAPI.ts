import { getToken } from "next-auth/jwt";

export async function secureApi(req) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
        return new Response("Unauthorized", { status: 401 });
    }

    return null;
}
