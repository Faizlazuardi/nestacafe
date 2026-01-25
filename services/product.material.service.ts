import prisma from "@/lib/prisma";

export function createProductIngredient(data: {productId: bigint; materialId: bigint; quantityUsed: number;}) {
    return prisma.productIngredient.create({
        data,
    });
}

export function updateProductIngredient(id: bigint, data: {productId: bigint; materialId: bigint; quantityUsed: number;}) {
    return prisma.productIngredient.update({
        where: { id },
        data,
    });
}

export function deleteProductIngredient(id: bigint) {
    return prisma.productIngredient.update({
        where: { id },
        data:{
            isDeleted: true
        }
    });
}