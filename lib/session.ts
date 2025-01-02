import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getValidatedSession() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    throw new Error("Unauthorized access.");
  }

  return session.user.id; // Return the logged-in user ID
}