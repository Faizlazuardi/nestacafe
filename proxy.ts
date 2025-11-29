import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    const pathname = request.nextUrl.pathname;
    
    if (pathname === "/"  && !token) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    
    const protectedRoutes = ["/kasir", "/admin"];
    
    const isProtected = protectedRoutes.some((p) =>
        pathname.startsWith(p)
    );
    
    if (isProtected && !token) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/admin/:path*", "/kasir/:path*"],
};
