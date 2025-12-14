import prisma from "../lib/prisma";

export async function createTransaction(data: any) {
    const {
        cashierId,
        paymentType,
        totalPrice,
        products,
    } = data;
    const transaction = await prisma.transaction.create({
        data: {
            cashierId: BigInt(cashierId),
            paymentType,
            totalPrice,
            transactions: {
                create: products.map((item: any) => ({
                    productId: BigInt(item.productId),
                    quantity: item.quantity,
                    subtotal: item.subtotal,
                })),
            },
        },
    });
    return transaction;
}