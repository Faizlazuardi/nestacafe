import prisma from "@/lib/prisma";
import { MaterialUnit } from "@prisma/client";


export async function getAllMaterials() {
    const materials = await prisma.material.findMany({
        where: { isDeleted: false },
        select: {
            id: true,
            name: true,
            unit: true,
            stock: true,
        },
    });
    return materials.map(material => ({
        ...material,
        id: String(material.id),
    }));
}

export async function createMaterial(data: { name: string; unit: MaterialUnit; stock: number }) {
    const result = await prisma.material.create({
        data,
    });
    if (!result) {
        return { error: new Error("Failed to create material") };
    }
    return { data: result };
}

export async function updateMaterial(id: bigint, data: { quantity: number }) {
    const result = await prisma.material.update({
        where: { id },
        data: {
            stock: { increment: data.quantity }
        },
    });
    if (!result) {
        return { error: new Error("Failed to update material") };
    }
    return { data: result };
}

export async function deleteMaterial(id: bigint) {
    const result = await prisma.material.update({
        where: { id },
        data: {
            isDeleted: true
        }
    });
    if (!result) {
        return { error: new Error("Failed to delete material") };
    }
    return { data: result };
}

export async function getTotalMaterials() {
    return prisma.material.count({
        where: { isDeleted: false },
    });
};