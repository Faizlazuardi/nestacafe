import { NextResponse } from "next/server";
import { getUserByNameAndPassowrd } from "@/app/service/auth.service";
import { UserRole } from "@prisma/client";

export async function POST(request: Request) {
    const secureCookie = process.env.NODE_ENV === "production";
    const form = await request.formData();
    const name = form.get("name") as string;
    const password = form.get("password") as string;
    try {
        const user = await getUserByNameAndPassowrd(name, password);
        
        const redirectTo =
            user.role === UserRole.admin ? "/admin" :
            user.role === UserRole.cashier ? "/kasir" : "/";
        
        const res = NextResponse.redirect(new URL(redirectTo, request.url));

        res.cookies.set("token", "logged_in", {
            httpOnly: true,
            secure: secureCookie,
            path: "/",
        });

        res.cookies.set("user", JSON.stringify({
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

