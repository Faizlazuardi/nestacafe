import { NextResponse } from "next/server";
import { getUserByNameAndPassowrd } from "@/app/service/auth.service";
import { UserRole } from "@prisma/client";

export async function POST(request: Request) {
    const secureCookie = process.env.NODE_ENV === "production";
    const data = await request.json();
    const { name, password } = data;
    
    try {
        const user = await getUserByNameAndPassowrd(name, password);
        const redirectTo =
            user.role === UserRole.admin ? "/admin" :
            user.role === UserRole.cashier ? "/kasir" : "/";
        
        const res = NextResponse.json(redirectTo);
        
        res.cookies.set("token", "logged_in", {
            httpOnly: true,
            secure: secureCookie,
            path: "/",
        });
        
        res.cookies.set("user", JSON.stringify({
            id: user.id.toString(),
            name: user.name,
            role: user.role,
        }), {
            httpOnly: false,
            secure: secureCookie,
            path: "/",
        });
        
        return res;
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message },
            { status: 400 }
        );
    }
}

