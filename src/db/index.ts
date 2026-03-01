import { createDatabase } from "@kilocode/app-builder-db";
import * as schema from "./schema";

// Lazy initialization - database is only created when first accessed
// This prevents build-time errors when DB env vars aren't available
let dbInstance: ReturnType<typeof createDatabase<typeof schema>> | null = null;

export const db = new Proxy({} as ReturnType<typeof createDatabase<typeof schema>>, {
  get(target, prop) {
    if (!dbInstance) {
      dbInstance = createDatabase(schema);
    }
    return dbInstance[prop as keyof typeof dbInstance];
  },
});
