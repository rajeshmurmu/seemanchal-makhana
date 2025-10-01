import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // allow auth routes
        if (
          pathname.startsWith("/api/auth") ||
          pathname.startsWith("/register") ||
          pathname.startsWith("/login") ||
          pathname.startsWith("/signup") ||
          pathname.startsWith("/signin") ||
          pathname.startsWith("/auth")
        )
          return true;

        // Public routes
        if (
          pathname === "/" ||
          pathname.startsWith("/api/products") ||
          pathname.startsWith("/products") ||
          pathname.startsWith("/contact") ||
          pathname.startsWith("/about")
        ) {
          return true;
        }

        // Admin routes require admin role
        if (
          pathname.startsWith("/api/admin") ||
          pathname.startsWith("/dashboard")
        ) {
          return token?.role === "admin";
        }

        if (!token) return false;
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/api/admin/:path*",
    // "/((?!_next/static|_next/image|favicon.ico|public/|images/).*)",
  ],
};
