import prisma from "@/lib/prisma";
import { getStartDate, TimeRange } from "@/lib/utils/date";
import { PaymentType } from "@prisma/client";

export async function getAllTransaction() {
    const transactions = await prisma.transaction.findMany({
        select: {
            id: true,
            paymentType: true,
            total: true,
            createdAt: true,
            cashier: {
                select:{
                    name: true
                }
            },
        }
    })
    return transactions.map( (transaction) => ({
        ...transaction,
        id: String(transaction.id),
    }))
}

export async function getDetailTransaction(id: bigint) {
    const details = await prisma.transactionDetail.findMany({
        where: {
            transactionId: id
        },
        select: {
            quantity: true,
            subtotal:true,
            product: {
                select: {
                    id: true,
                    option: true,
                    price: true,
                    base: {
                        select: {
                            name: true
                        }
                    }
                }
            }
        }
    })
    return details.map(detail => ({
        id: String(detail.product.id),
        name: detail.product.base.name,
        option: detail.product.option,
        quantity: detail.quantity,
        price: detail.product.price,
        subtotal: detail.subtotal
    }))
}

export async function createTransaction(data: any) {
    const {
        cashierId,
        paymentType,
        total,
        products,
    }: {
        cashierId: string,
        paymentType: PaymentType,
        total: number,
        products: {
            id: string,
            quantity: number,
            subtotal: number
        } []
    } = data;

    const productQtyMap = Object.fromEntries(
        products.map(product => [product.id, product.quantity])
    );

    return await prisma.$transaction(async (tx) => {
        const transaction = await tx.transaction.create({
            data: {
                cashierId: BigInt(cashierId),
                paymentType,
                total,
                details: {
                    create: products.map(product => ({
                        productId: BigInt(product.id),
                        quantity: product.quantity,
                        subtotal: product.subtotal,
                    })),
                },
            },
        });

        const variants = await tx.productVariant.findMany({
            where: {
                id: {
                    in: products.map(product => BigInt(product.id)),
                },
            },
            select: {
                id: true,
                ingredients:{
                    select:{
                        materialId:true,
                        quantityUsed:true,
                    }
                }
            }
        });

        const materialTotals = variants
            .flatMap(variant =>
                variant.ingredients.map(ing => ({
                    materialId: ing.materialId,
                    total: ing.quantityUsed * productQtyMap[String(variant.id)],
                }))
            )
            .reduce<Record<string, { materialId: bigint; total: number }>>((acc, item) => {
                const key = String(item.materialId);
                if (!acc[key]) {
                    acc[key] = { materialId: item.materialId, total: 0 };
                }
                acc[key].total += item.total;
                return acc;
            }, {});

        for (const mat of Object.values(materialTotals)) {
            const material = await tx.material.findUnique({
            where: { id: mat.materialId },
                select: { stock: true },
            });
            
            if (!material || material.stock < mat.total) {
                throw new Error(`Stok material tidak cukup`);
            }
        }

        for (const mat of Object.values(materialTotals)) {
            await tx.material.update({
                where: { id: mat.materialId },
                    data: {
                        stock: {
                            decrement: mat.total,
                        },
                    },
                }
            );
        }
        return transaction;
    });
}

export async function getTotalRevenue (time: TimeRange) {
    const result  = await prisma.transaction.aggregate({
        _sum: {
            total: true
        },
        where: {
            createdAt: {
                gte: getStartDate(time),
            },
        },
    });
    return result._sum.total ?? 0
}