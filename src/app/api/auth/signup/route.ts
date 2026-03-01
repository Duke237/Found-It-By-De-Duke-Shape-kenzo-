import { NextResponse } from "next/server";
import { setSessionCookie } from "@/lib/auth/session";
import { validateSignup } from "@/lib/auth/validation";
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

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | {
        username?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
      }
    | null;

  const username = body?.username?.trim() ?? "";
  const email = body?.email?.trim() ?? "";
  const password = body?.password ?? "";
  const confirmPassword = body?.confirmPassword ?? "";

  const errors = validateSignup({ username, email, password, confirmPassword });
  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { error: "Invalid signup details.", fieldErrors: errors },
      { status: 400 }
    );
  }

  // Check if user already exists
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (existingUser.length > 0) {
    return NextResponse.json(
      { error: "User with this email already exists." },
      { status: 400 }
    );
  }

  // Create user in database
  const passwordHash = simpleHash(password);
  const [newUser] = await db
    .insert(users)
    .values({
      username,
      email,
      passwordHash,
      role: "user",
    })
    .returning();

  const res = NextResponse.json({ user: { id: String(newUser.id), username: newUser.username, email: newUser.email, role: newUser.role } });
  setSessionCookie(res, { id: String(newUser.id), username: newUser.username, email: newUser.email, role: newUser.role });
  return res;
}

