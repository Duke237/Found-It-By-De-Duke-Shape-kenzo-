import { NextResponse } from "next/server";
import { setSessionCookie } from "@/lib/auth/session";
import { validateLogin } from "@/lib/auth/validation";

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

  // Demo auth: accept any email/password that passes validation.
  const res = NextResponse.json({ user: { email } });
  setSessionCookie(res, { email });
  return res;
}

