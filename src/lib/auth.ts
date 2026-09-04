import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { count } from "drizzle-orm";
import { db } from "@/db";
import { accounts, sessions, users, verifications } from "@/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user: users, session: sessions, account: accounts, verification: verifications },
  }),
  emailAndPassword: { enabled: true, requireEmailVerification: false },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const [{ total }] = await db.select({ total: count() }).from(users);
          return { data: { ...user, role: total === 0 ? "SUPER_ADMIN" : "SCOREKEEPER" } };
        },
      },
    },
  },
  user: {
    additionalFields: {
      role: { type: "string", required: false, input: false, defaultValue: "SCOREKEEPER" },
      assignedEventId: { type: "string", required: false, input: false },
    },
  },
  trustedOrigins: process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : [],
});
