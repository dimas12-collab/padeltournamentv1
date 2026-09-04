import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) return NextResponse.json({ user: null }, { status: 401 });
  const user = await db.query.users.findFirst({ where: eq(users.id, session.user.id), columns: { id: true, name: true, email: true, role: true, assignedEventId: true } });
  return NextResponse.json({ user: user ?? null });
}
