import prisma from "@/app/lib/prisma";
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
        id: material.id.toString(),
    }));
}

export async function createMaterial(data: { name: string; type: MaterialType; quantity: number }) {
    return await prisma.material.create({
        data,
    });
}

export async function updateMaterial(id: bigint, data: { name: string; type: MaterialType; quantity: number }) {
    return await prisma.material.update({
        where: { id },
        data,
    });
}

export async function deleteMaterial(id: bigint) {
    return await prisma.material.delete({
        where: { id },
    });
}