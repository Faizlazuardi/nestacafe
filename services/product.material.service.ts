import prisma from "@/lib/prisma";
import { VariantOption } from "@prisma/client";

export function createProductMaterial(data: {productId: bigint; materialId: bigint; quantityUsed: number;}) {
    return prisma.productMaterial.create({
        data,
    });
}

export function updateProductMaterial(id: bigint, data: {productId: bigint; materialId: bigint; quantityUsed: number;}) {
    return prisma.productMaterial.update({
        where: { id },
        data,
    });
}

export function deleteProductMaterial(id: bigint) {
    return prisma.productMaterial.update({
        where: { id },
        data:{
            isDeleted: true
        }
    });
}