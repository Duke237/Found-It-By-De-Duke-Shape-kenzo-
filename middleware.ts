import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "findit_session";

function isAuthed(req: NextRequest) {
  return Boolean(req.cookies.get(SESSION_COOKIE)?.value);
}

export function middleware(req: NextRequest) {
  if (isAuthed(req)) return NextResponse.next();

  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.searchParams.set(
    "next",
    `${req.nextUrl.pathname}${req.nextUrl.search}`
  );
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/report/:path*", "/browse/:path*", "/dashboard/:path*"],
};

