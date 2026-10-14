/**
 * proxy.ts — Dravion authentication proxy (renamed from middleware.ts)
 *
 * Next.js 16 renames the "middleware" file convention to "proxy".
 * The exported function must be named `proxy` (not `middleware`).
 * Run `npx @next/codemod@canary middleware-to-proxy .` to automate this.
 *
 * Docs: node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md
 */
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export const proxy = withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Strict role-based authorization for the admin portal
    if (path.startsWith("/admin") && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// Protected routes that require being logged in
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
