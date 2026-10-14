export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required before database migrations can run.");
  }

  const [{ migrate }, { db }] = await Promise.all([
    import("drizzle-orm/postgres-js/migrator"),
    import("@/db"),
  ]);

  await migrate(db, { migrationsFolder: "drizzle" });
  console.info("Database migrations applied.");
}
