import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "findit_session";

function isAuthed(req: NextRequest) {
  return Boolean(req.cookies.get(SESSION_COOKIE)?.value);
}

export function middleware(req: NextRequest) {
  const isAuth = isAuthed(req);
  const pathname = req.nextUrl.pathname;

  // If authenticated and trying to access landing or auth pages, redirect to dashboard
  if (isAuth && (pathname === "/" || pathname === "/login" || pathname === "/signup")) {
    const dashboardUrl = req.nextUrl.clone();
    dashboardUrl.pathname = "/dashboard";
    return NextResponse.redirect(dashboardUrl);
  }

  // If not authenticated and trying to access protected routes, redirect to login
  if (!isAuth && (pathname.startsWith("/dashboard") || pathname.startsWith("/report") || pathname.startsWith("/browse"))) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", `${pathname}${req.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/signup",
    "/report/:path*",
    "/browse/:path*",
    "/dashboard/:path*",
  ],
};

