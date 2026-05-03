import prisma from "@/lib/prisma";
import { VariantOption } from "@prisma/client";

export async function createProductVariant(data: {baseId: bigint; price: number; option: VariantOption;}) {
    const result = await prisma.productVariant.create({
        data,
    });
    if (!result) {
        return { error: new Error("Failed to create product variant") };
    }
    return { data: result };
}

export async function updateProductVariant(id: bigint, data: {baseId: bigint; price: number; option: VariantOption;}) {
    const result = await prisma.productVariant.update({
        where: { id },
        data,
    });
    if (!result) {
        return { error: new Error("Failed to update product variant") };
    }
    return { data: result };
}

export async function deleteProductVariant(id: bigint) {
    const result = await prisma.$transaction(async (tx) => {
        const variants = await tx.productVariant.update({
            where: { id },
            data: { isDeleted: true },
        });

        const ingredients = await tx.productIngredient.updateMany({
            where: {
                productId: id,
                isDeleted: false,
            },
            data: {
                isDeleted: true,
            },
        });
        return { variants, ingredients };
    });
    if (!result) {
        return { error: new Error("Failed to delete product variant") };
    }
    return { data: result };
}
