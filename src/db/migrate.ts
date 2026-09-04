import "dotenv/config";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "./index";
async function main() {
  await migrate(db, { migrationsFolder: "drizzle" });
  console.log("Database migrations applied.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
