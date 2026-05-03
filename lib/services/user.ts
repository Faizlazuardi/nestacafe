import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

export async function getAllUsers(){
    const users = await prisma.user.findMany({
        where: {
            isActive: true
        },
        select: {
            id: true,
            name: true,
            role: true,
        },
    });
    return users.map(item => ({
        ...item,
        id: String(item.id)
    }));
}

export async function createUser(name: string, password: string) {
    const existingUser = await prisma.user.findUnique({
        where: { name },
    });
    if (existingUser) {
        return { error: new Error("User telah terdaftar") };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            name: name,
            password: hashedPassword,
            role: UserRole.Cashier
        },
    });
    if (!user) {
        return { error: new Error("Failed to create user") };
    }
    return {
        data: {
            message: "User berhasil dibuat",
            user: {
                id: user.id,
                name: user.name,
            },
        }
    };
}

export async function updateUser(id:bigint, formData: {name: string, password: string}) {
    const hashedPassword = await bcrypt.hash(formData.password, 10);
    const data = {
        name: formData.name,
        password: hashedPassword
    }
    const result = await prisma.user.update({
        where: { id },
        data,
    });
    if (!result) {
        return { error: new Error("Failed to update user") };
    }
    return { data: result };
}

export async function deleteUser(id: bigint) {
    const result = await prisma.user.update({
        where: { id },
        data: {
            isActive: false
        }
    });
    if (!result) {
        return { error: new Error("Failed to delete user") };
    }
    return { data: result };
}
