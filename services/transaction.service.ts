import prisma from "@/lib/prisma";
import { getStartDate, TimeRange } from "@/utils/date";

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
                    base: {
                        select: {
                            name: true
                        }
                    }
                }
            }
        }
    })
}

export async function createTransaction(data: any) {
    const {
        cashierId,
        paymentType,
        total,
        products,
    } = data;
    
    const transaction = await prisma.transaction.create({
        data: {
            cashierId: BigInt(cashierId),
            paymentType,
            total,
            details: {
                create: products.map((product: any) => ({
                    productId: BigInt(product.id),
                    quantity: product.quantity,
                    subtotal: product.subtotal,
                })),
            },
        },
    });
    
    const variants = await prisma.productVariant.findMany({
        where: {
            id: {
                in: products.map((product: any) => BigInt(product.id)),
            },
        },
        select: {
            id: true,
            productMaterials: {
                select: {
                    materialId: true,
                    quantityUsed: true,
                },
            },
        },
    });
    
    const productQtyMap = Object.fromEntries(
        products.map((p: any) => [p.id, p.quantity])
    );
    
    const materials = variants.flatMap(variant =>
        variant.productMaterials.map(pm => ({
            materialId: pm.materialId,
            quantityUsed: pm.quantityUsed * productQtyMap[String(variant.id)],
        }))
    );
    
    const materialTotals = materials.reduce<Record<string, { materialId: bigint; total: number }>>((acc, item) => {
        const key = String(item.materialId);
        if (!acc[key]) {
            acc[key] = {
                materialId: item.materialId,
                total: 0,
            };
        }
        acc[key].total += item.quantityUsed;
        return acc;
    }, {});
    
    const materialUpdates = await prisma.$transaction(
        Object.values(materialTotals).map(mat =>
            prisma.material.update({
                where: {
                    id: mat.materialId,
                },
                data: {
                    quantity: {
                        decrement: mat.total,
                    },
                },
            })
        )
    );
    
    return transaction;
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