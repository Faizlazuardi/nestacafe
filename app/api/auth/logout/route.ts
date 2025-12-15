import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const res = NextResponse.json({redirectTo: "/auth/login"});

    
    res.cookies.set("token", "", {
        httpOnly: true,
        path: "/",
        expires: new Date(0)
    });
    
    res.cookies.set("user", "", {
        path: "/",
        expires: new Date(0)
    });
    
    return res;
}
