import prisma from "@/lib/prisma";

export async function createProductIngredient(data: {productId: bigint; materialId: bigint; quantityUsed: number;}) {
    const result = await prisma.productIngredient.create({
        data,
    });
    if (!result) {
        return { error: new Error("Failed to create product ingredient") };
    }
    return { data: result };
}

export async function updateProductIngredient(id: bigint, data: {productId: bigint; materialId: bigint; quantityUsed: number;}) {
    const result = await prisma.productIngredient.update({
        where: { id },
        data,
    });
    if (!result) {
        return { error: new Error("Failed to update product ingredient") };
    }
    return { data: result };
}

export async function deleteProductIngredient(id: bigint) {
    const result = await prisma.productIngredient.update({
        where: { id },
        data:{
            isDeleted: true
        }
    });
    if (!result) {
        return { error: new Error("Failed to delete product ingredient") };
    }
    return { data: result };
}