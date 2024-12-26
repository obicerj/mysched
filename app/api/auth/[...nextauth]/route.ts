import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";

// Bind the API route to the NextAuth handler for both GET and POST methods
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, handler as signIn, handler as SignOut, handler as auth, handler as useSession };
