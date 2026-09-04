import "server-only";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";

export async function requireUser(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) throw new Response("Unauthorized", { status: 401 });
  const user = await db.query.users.findFirst({ where: eq(users.id, session.user.id) });
  // Better Auth's user type doesn't include the app profile without client inference.
  if (!user) throw new Response("User profile not found", { status: 403 });
  return user;
}

export function canManageEvent(user: { role: string; assignedEventId: string | null }, eventId: string) {
  return user.role === "SUPER_ADMIN" || (user.role === "EVENT_ADMIN" && user.assignedEventId === eventId);
}
