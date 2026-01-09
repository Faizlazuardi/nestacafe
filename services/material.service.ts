import prisma from "@/lib/prisma";
import { MaterialType } from "@prisma/client";


export async function getAllMaterials() {
    const materials = await prisma.material.findMany({
        select: {
            id: true,
            name: true,
            type: true,
            quantity: true,
        },
    });
    return materials.map(material => ({
        ...material,
        id: String(material.id),
    }));
}

export async function createMaterial(data: { name: string; type: MaterialType; quantity: number }) {
    return await prisma.material.create({
        data,
    });
}

export async function updateMaterial(id: bigint, data: { quantity: number }) {
    return await prisma.material.update({
        where: { id },
        data: {
            quantity: { increment: data.quantity }
        },
    });
}

export async function deleteMaterial(id: bigint) {
    return await prisma.material.update({
        where: { id },
        data:{
            isDeleted: true
        }
    });
}

export async function getTotalMaterials() {
    return prisma.material.count({
        where: { isDeleted: false },
    });
};