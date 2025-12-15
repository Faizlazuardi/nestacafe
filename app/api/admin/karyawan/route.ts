import { createUser, getAllUsers } from "@/app/service/auth.service";

export async function GET(): Promise<Response> {
    try {
        const users = await getAllUsers();
        return new Response(JSON.stringify(users), { status: 200 });
    } catch (error: any) {
        return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
}

export async function POST(request: Request): Promise<Response> {
    const { username, password } = await request.json();
    try {
        const result = await createUser(username, password);
        return new Response(JSON.stringify(result), { status: 201 });
    } catch (error: any) {
        return new Response(JSON.stringify({ message: error.message }), { status: 400 });
    }
}