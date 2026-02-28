import { NextResponse } from "next/server";
import { setSessionCookie } from "@/lib/auth/session";
import { validateSignup } from "@/lib/auth/validation";

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

  // Demo auth: no persistence; session cookie is enough for UI + routing.
  const res = NextResponse.json({ user: { username, email, role: "user" } });
  setSessionCookie(res, { username, email, role: "user" });
  return res;
}

