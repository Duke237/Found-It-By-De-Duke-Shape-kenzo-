import { NextResponse } from "next/server";
import { setSessionCookie } from "@/lib/auth/session";
import { validateLogin } from "@/lib/auth/validation";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

// Simple hash function for demo (in production, use bcrypt)
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}

// Admin credentials
const ADMIN_EMAIL = "nebaericsuh@gmail.com";
const ADMIN_PASSWORD = "(123qweQWE";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | { email?: string; password?: string }
    | null;

  const email = body?.email?.trim() ?? "";
  const password = body?.password ?? "";

  const errors = validateLogin({ email, password });
  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { error: "Invalid credentials.", fieldErrors: errors },
      { status: 400 }
    );
  }

  // Check for admin credentials first
  const isAdmin = email === ADMIN_EMAIL && password === ADMIN_PASSWORD;
  
  if (isAdmin) {
    // Check if admin exists in database, if not create
    const existingAdmin = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingAdmin.length === 0) {
      // Create admin user
      await db.insert(users).values({
        username: "Admin",
        email,
        passwordHash: simpleHash(password),
        role: "admin",
      });
    }
    
    const res = NextResponse.json({ user: { email, role: "admin" } });
    setSessionCookie(res, { email, role: "admin" });
    return res;
  }

  // Check user in database
  const passwordHash = simpleHash(password);
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (!user || user.passwordHash !== passwordHash) {
    return NextResponse.json(
      { error: "Invalid credentials." },
      { status: 401 }
    );
  }

  const res = NextResponse.json({ user: { username: user.username, email: user.email, role: user.role } });
  setSessionCookie(res, { username: user.username, email: user.email, role: user.role });
  return res;
}

