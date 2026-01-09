import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function authenticateUser(name: string, password: string) {
    const user = await prisma.user.findUnique({
        select: {
            id: true,
            name: true,
            password: true,
            role: true,
        },
        where: { name }
    });

    if (!user) {
        throw new Error("username atau password salah");
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("username atau password salah");
    }
    return {
        id: user.id,
        name: user.name,
        role: user.role,
    };
}