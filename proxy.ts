import { auth } from "@/auth";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";

export default auth(function proxy(req) {
    const { pathname } = req.nextUrl;
    const session = req.auth;

    if (!session && !pathname.startsWith("/auth/login")) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    if (!session) return NextResponse.next();

    const role = session.user?.role;

    if (role === UserRole.admin && !pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/admin", req.url));
    }

    if (role === UserRole.cashier && !pathname.startsWith("/kasir")) {
        return NextResponse.redirect(new URL("/kasir", req.url));
    }

    return NextResponse.next();
});


export const config = {
    matcher: [
        "/", 
        "/admin/:path*", 
        "/kasir/:path*", 
        "/dashboard/:path*", 
        "/auth/:path*"
    ]
};
