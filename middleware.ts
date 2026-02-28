import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "findit_session";

function isAuthed(req: NextRequest) {
  return Boolean(req.cookies.get(SESSION_COOKIE)?.value);
}

function getUserRole(req: NextRequest): "user" | "admin" | null {
  const cookieValue = req.cookies.get(SESSION_COOKIE)?.value;
  if (!cookieValue) return null;
  
  try {
    // Decode the base64 session
    const decoded = Buffer.from(cookieValue, "base64url").toString("utf8");
    const user = JSON.parse(decoded);
    return user.role === "admin" ? "admin" : "user";
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const isAuth = isAuthed(req);
  const userRole = getUserRole(req);
  const pathname = req.nextUrl.pathname;

  // Admin routes
  const isAdminRoute = pathname.startsWith("/admin");
  const isUserRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/report") || pathname.startsWith("/browse");
  const isAuthPage = pathname === "/" || pathname === "/login" || pathname === "/signup";

  // If not authenticated, redirect to login
  if (!isAuth) {
    // Allow landing page, login, and signup
    if (isAuthPage) {
      return NextResponse.next();
    }
    // Redirect protected routes to login
    if (isUserRoute || isAdminRoute) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("next", `${pathname}${req.nextUrl.search}`);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // If authenticated
  if (isAuth) {
    // Admin trying to access user routes -> redirect to admin dashboard
    if (userRole === "admin" && isUserRoute) {
      const adminUrl = req.nextUrl.clone();
      adminUrl.pathname = "/admin";
      return NextResponse.redirect(adminUrl);
    }

    // Regular user trying to access admin routes -> redirect to user dashboard
    if (userRole === "user" && isAdminRoute) {
      const dashboardUrl = req.nextUrl.clone();
      dashboardUrl.pathname = "/dashboard";
      return NextResponse.redirect(dashboardUrl);
    }

    // Authenticated user on landing/login/signup -> redirect to appropriate dashboard
    if (isAuthPage) {
      const targetUrl = req.nextUrl.clone();
      targetUrl.pathname = userRole === "admin" ? "/admin" : "/dashboard";
      return NextResponse.redirect(targetUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/signup",
    "/admin/:path*",
    "/report/:path*",
    "/browse/:path*",
    "/dashboard/:path*",
  ],
};

