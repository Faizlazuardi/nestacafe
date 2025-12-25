import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

export async function getAllUsers(){
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            role: true,
        },
    });
    return users.map(item => ({
        ...item,
        id: item.id.toString()
    }));
}

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

export async function createUser(name: string, password: string) {
    const existingUser = await prisma.user.findUnique({
        where: { name },
    });
    if (existingUser) {
        throw new Error("User telah terdaftar");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            name: name,
            password: hashedPassword,
            role: UserRole.cashier
        },
    });
    return {
        message: "User berhasil dibuat",
        user: {
        id: user.id,
        name: user.name,
        },
    };
}