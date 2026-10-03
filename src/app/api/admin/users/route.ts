import { hashPassword } from "better-auth/crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { accounts, auditLogs, events, users } from "@/db/schema";
import { requireUser } from "@/lib/permissions";
import { eq } from "drizzle-orm";

const createUserSchema = z.object({
  name: z.string().trim().min(1, "Enter the user's name."),
  email: z.email("Enter a valid email address.").transform((value) => value.toLowerCase()),
  password: z.string().min(8, "Password must contain at least 8 characters.").max(128, "Password must contain at most 128 characters."),
  role: z.enum(["SUPER_ADMIN", "EVENT_ADMIN", "SCOREKEEPER"]),
  eventId: z.string().min(1, "Select an assigned event."),
});

export async function POST(request: Request) {
  try {
    const currentUser = await requireUser(request);
    if (currentUser.role !== "SUPER_ADMIN") return NextResponse.json({ error: "Only Super Admins can create users." }, { status: 403 });

    const parsed = createUserSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid user details." }, { status: 400 });

    const assignedEvent = await db.query.events.findFirst({ where: eq(events.id, parsed.data.eventId), columns: { id: true } });
    if (!assignedEvent) return NextResponse.json({ error: "The assigned event does not exist." }, { status: 400 });
    const existingUser = await db.query.users.findFirst({ where: eq(users.email, parsed.data.email), columns: { id: true } });
    if (existingUser) return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });

    const id = crypto.randomUUID();
    const password = await hashPassword(parsed.data.password);
    await db.transaction(async (tx) => {
      await tx.insert(users).values({ id, name: parsed.data.name, email: parsed.data.email, role: parsed.data.role, assignedEventId: parsed.data.eventId });
      await tx.insert(accounts).values({ id: crypto.randomUUID(), accountId: id, providerId: "credential", issuer: "local:credential", userId: id, password });
      await tx.insert(auditLogs).values({ id: crypto.randomUUID(), userId: currentUser.id, action: "Created user account", entityType: "users", entityId: id, afterData: { name: parsed.data.name, email: parsed.data.email, role: parsed.data.role, assignedEventId: parsed.data.eventId } });
    });

    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    const status = error instanceof Response ? error.status : 400;
    const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
    const message = code === "23505" ? "An account with this email already exists." : error instanceof Response ? await error.text() : error instanceof Error ? error.message : "Could not create the user account.";
    return NextResponse.json({ error: message }, { status });
  }
}
