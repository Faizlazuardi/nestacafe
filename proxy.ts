import { UserRole } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    const userCookie = request.cookies.get("user")?.value;
    const url = request.nextUrl;
    const pathname = url.pathname;
    
    let user: { role: string } | null = null;
    if (userCookie) {
        try {
            user = JSON.parse(decodeURIComponent(userCookie));
        } catch {
            user = null;
        }
    }
    
    if (!token && !pathname.startsWith("/auth/login")) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    
    if (!user) {
        return NextResponse.next();
    }
    
    if (user.role === UserRole.admin && !pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/admin", request.url));
    }
    else if (user.role === UserRole.cashier && !pathname.startsWith("/kasir")) {
        return NextResponse.redirect(new URL("/kasir", request.url));
    }
}

export const config = {
    matcher: [
        "/", 
        "/admin/:path*", 
        "/kasir/:path*", 
        "/dashboard/:path*", 
        "/auth/:path*"
    ]
};
