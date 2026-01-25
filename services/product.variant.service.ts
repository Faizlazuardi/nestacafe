import prisma from "@/lib/prisma";
import { VariantOption } from "@prisma/client";

export function createProductVariant(data: {baseId: bigint; price: number; option: VariantOption;}) {
    return prisma.productVariant.create({
        data,
    });
}

export function updateProductVariant(id: bigint, data: {baseId: bigint; price: number; option: VariantOption;}) {
    return prisma.productVariant.update({
        where: { id },
        data,
    });
}

export async function deleteProductVariant(id: bigint) {
    await prisma.$transaction(async (tx) => {
        await tx.productVariant.update({
            where: { id },
            data: { isDeleted: true },
        });

        await tx.productIngredient.updateMany({
            where: {
                productId: id,
                isDeleted: false,
            },
            data: {
                isDeleted: true,
            },
        });
    });
}
