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
    // CredentialsProvider({
    //     name: "Credentials",
    //     credentials: {
    //         email: { label: "Email", type: "text" },
    //         password: { label: "Password", type: "password" },
    //     },
    //     async authorize(credentials) {
    //         const { email, password } = credentials;
    //         if (!email || !password) return null;

    //         // Query database for the user
    //         const query = `SELECT * FROM users WHERE email = ?`;
    //         const [rows] = await connectionPool.execute(query, [email]);

    //         if (!rows || rows.length === 0) {
    //             throw new Error("Invalid email or password");
    //         }

    //         const user = rows[0];

    //         // TODO: Verify the password (e.g., using bcrypt)
    //         // For simplicity: if passwords match in plain text
    //         if (password !== user.password) {
    //             throw new Error("Invalid email or password");
    //         }

    //         return { id: user.id, name: user.name, email: user.email };
    //     },
    // }),
  ],
  callbacks: {
    // run when user sign in
    async signIn({ user, account }) {
        const { email, name, image } = user;
  
        
        try {
        //   const connection = await connectionPool.execute(dbConfig);
  
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
        // if (token.id) {
        //   session.user.id = token.id;
        // }
        // return session;
        if (token.id) {
            const [rows] = await connectionPool.query("SELECT * FROM users WHERE id = ?", [token.id]);
        
            if (rows.length > 0) {
              session.user = { ...session.user, ...rows[0] }; // Merge user data into the session
            }
          }
          return session;
      },
  

    // async session({ session, token }) {
    //   session.user.id = token.sub;
    //   return session;
    // },

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

    // async jwt({ token, account }) {
    //   if (account) {
    //     token.sub = account?.providerAccountId;
    //   }
    //   return token;
    // },
  },

// session: {
//     strategy: "jwt",
// },
// callbacks: {
//     async jwt({ token, user }) {
//         if (user) {
//             token.id = user.id;
//             token.name = user.name;
//             token.email = user.email;
//         }
//         return token;
//     },
//     async session({ session, token }) {
//         session.user.id = token.id;
//         return session;
//     },
// },


  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
//   pages: {
//     signIn: "/api/auth/signin",
// },
};
