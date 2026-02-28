import { cookies } from "next/headers";
import type { NextResponse } from "next/server";

export type SessionUser = {
  username?: string;
  email: string;
  role: "user" | "admin";
};

const COOKIE_NAME = "findit_session";

function encodeSession(user: SessionUser) {
  return Buffer.from(JSON.stringify(user), "utf8").toString("base64url");
}

function decodeSession(value: string): SessionUser | null {
  try {
    const json = Buffer.from(value, "base64url").toString("utf8");
    const parsed = JSON.parse(json) as Partial<SessionUser>;
    if (!parsed.email || typeof parsed.email !== "string") return null;
    return {
      email: parsed.email,
      username: typeof parsed.username === "string" ? parsed.username : undefined,
      role: parsed.role === "admin" ? "admin" : "user",
    };
  } catch {
    return null;
  }
}

export function setSessionCookie(res: NextResponse, user: SessionUser) {
  res.cookies.set({
    name: COOKIE_NAME,
    value: encodeSession(user),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearSessionCookie(res: NextResponse) {
  res.cookies.set({
    name: COOKIE_NAME,
    value: "",
    path: "/",
    maxAge: 0,
  });
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return null;
  return decodeSession(raw);
}
