import { createDatabase } from "@kilocode/app-builder-db";
import * as schema from "./schema";

// Truly lazy initialization - database is only created when getDb() is called
// This prevents build-time errors when DB env vars aren't available

type DbType = ReturnType<typeof createDatabase<typeof schema>>;

let dbInstance: DbType | null = null;

function createDb(): DbType {
  if (!dbInstance) {
    dbInstance = createDatabase(schema);
  }
  return dbInstance;
}

// Export a function that must be called to get the database
// This ensures lazy initialization at runtime only
export function getDb(): DbType {
  return createDb();
}

// For backwards compatibility, export a proxy that lazy-loads
// but make sure it doesn't trigger at import time
export const db = new Proxy({} as DbType, {
  get(_target, prop) {
    return createDb()[prop as keyof DbType];
  },
  has(_target, _prop) {
    return true; // Pretend all properties exist to avoid errors
  },
});
