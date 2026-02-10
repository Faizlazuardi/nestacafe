import prisma from "@/lib/prisma";
import { getStartDate, TimeRange } from "@/lib/utils/date";

export async function getAllProducts() {
    const products = await prisma.productBase.findMany({
        where: {
            isDeleted: false,
        },
        select: {
            id: true,
            name: true,
            image: true,
            variants: {
                where: {
                    isDeleted: false,
                },
                select: {
                    id: true,
                    price: true,
                    option: true,
                    ingredients: {
                        where: {
                            isDeleted: false,
                        },
                        select: {
                            quantityUsed: true,
                            material: {
                                select: {
                                    id: true,
                                    name: true,
                                    unit: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });
    
    return products.map(({ id, name, image, variants }) => ({
        id: String(id),
        name,
        image,
        variants: variants.map(({ id, option, price, ingredients }) => ({
            id: String(id),
            option,
            price,
            materials: ingredients.map(({ material: {id, name, unit}, quantityUsed }) => ({
                id: String(id),
                name,
                unit,
                quantityUsed
            }))
        }))
    }))
}

export async function getCashierProducts() {
    const products = await prisma.productBase.findMany({
        where: {
            isDeleted: false,
        },
        select: {
            id: true,
            name: true,
            image: true,
            variants: {
                where: {
                    isDeleted: false,
                },
                select: {
                    id: true,
                    price: true,
                    option: true,
                    ingredients: {
                        where: {
                            isDeleted: false,
                        },
                        select: {
                            quantityUsed: true,
                            material: {
                                select: {
                                    id: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });
    
    return products.map(({ id, name, image, variants }) => ({
        id: String(id),
        name,
        image,
        variants: variants.map(({ id, option, price, ingredients }) => ({
            id: String(id),
            option,
            price,
            materials: ingredients.map(({ material: { id }, quantityUsed }) => ({
                id: String(id),
                quantityUsed,
            })),
        })),
    }))
}

export async function createProduct(data: { name: string; image: string }) {
    return await prisma.productBase.create({
        data
    });
}

export async function updateProduct(id: bigint, data: { name: string; image?: string }) {
    return await prisma.productBase.update({
        where: { id },
        data,
    });
}

export async function deleteProduct(id: bigint) {
    await prisma.$transaction(async (tx) => {
        await tx.productBase.update({
            where: { id },
            data: { isDeleted: true },
        });

        await tx.productVariant.updateMany({
            where: {
                baseId: id,
                isDeleted: false,
            },
            data: {
                isDeleted: true,
            },
        });

        await tx.productIngredient.updateMany({
            where: {
                product: {
                    baseId: id,
                },
                isDeleted: false,
            },
            data: {
                isDeleted: true,
            },
        });
    });
}

export async function getSoldProducts(time: TimeRange) {
    const details = await prisma.transactionDetail.groupBy({
        by: ['productId'],
        _sum: {
            quantity: true,
        },
        where: {
            transaction: {
                createdAt: {
                    gte: getStartDate(time),
                },
            },
        },
    });
    
    const variants = await prisma.productVariant.findMany({
        where: {
            id: { in: details.map(d => d.productId) },
        },
        select: {
            id: true,
            base: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                },
            },
        },
    });
    
    const variantToBase = new Map(
        variants.map(v => [v.id, v.base])
    );
    
    const baseTotals = details.reduce<Record<string, { id: string; name: string; image: string; totalQuantity: number }>>((acc, d) => {
        const base = variantToBase.get(d.productId);
        if (!base) return acc;
        
        const key = String(base.id);
        acc[key] ??= {
            id: key,
            name: base.name,
            image: base.image,
            totalQuantity: 0,
        };
        
        acc[key].totalQuantity += d._sum.quantity ?? 0;
        return acc;
    }, {});
    
    return Object.values(baseTotals)
        .sort((a, b) => b.totalQuantity - a.totalQuantity)
        .slice(0, 3);
}

export async function getTotalProducts () {
    return prisma.productBase.count({
        where: { isDeleted: false },
    });
};
