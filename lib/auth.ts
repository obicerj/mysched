import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectionPool from "./db";


export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  debug: true,
  callbacks: {
    // run when user sign in
    async signIn({ user, account }) {
        const { email, name, image } = user;

        try {
          // Check if the user already exists
          const [rows] = await connectionPool.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
          );
  
          if (rows.length === 0) {
            // Insert the user into the database if they don't exist
            await connectionPool.execute(
              "INSERT INTO users (name, email, image, google_id) VALUES (?, ?, ?, ?)",
              [name, email, image, account?.providerAccountId]
            );
          }
  
        //   await connection.end();
        } catch (error) {
          console.error("Database error:", error);
          return false; // Prevent sign-in if there's an issue
        }
  
        return true; // Allow sign-in
      },

      // attach user ID to the session
    async session({ session, token }) {

        if (token.id) {
            const [rows] = await connectionPool.query("SELECT * FROM users WHERE id = ?", [token.id]);
        
            if (rows.length > 0) {
              session.user = { ...session.user, ...rows[0] }; // Merge user data into the session
            }
          }
          return session;
      },
  
    // add user ID to JWT for session handling
    async jwt({ token, account, user }) {
        if (user) {

          const [rows] = await connectionPool.query("SELECT id FROM users WHERE email = ?", [user.email]);
  
          if (rows.length > 0) {
            token.id = rows[0].id; // Attach user ID from database
          }

        }
        return token;
      },

    async redirect({ url, baseUrl }) {
      // redirect to the home page after successful sign-in
      if (url.startsWith(baseUrl)) return url;
      if (url === "/api/auth/signin") return "/";
      return baseUrl;
    },

    
      
  },
  pages: {
    signIn: '/auth/signin'
  }
};
