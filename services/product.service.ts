import prisma from "@/lib/prisma";
import { VariantOption } from "@prisma/client";
import { getStartDate } from "@/utils/date";

export async function getAllProducts() {
    const products = await prisma.productBase.findMany({
        select: {
            id: true,
            name: true,
            image: true,
            products: {
                select: {
                    id: true,
                    price: true,
                    variant: true
                }
            }
        }
    });
    
    return products.map(base => ({
        ...base,
        id: base.id.toString(),
        products: base.products.map(product => ({
            ...product,
            id: product.id.toString()
        }))
    }));
}


export async function createProduct(data: { name: string; price: number, baseId:bigint, variant:VariantOption }) {
    return await prisma.product.create({
        data,
    });
}

export async function updateProduct(id: bigint, data: { name: string; price: number, baseId:bigint, variant:VariantOption }) {
    return await prisma.product.update({
        where: { id },
        data,
    });
}

export async function deleteProduct(id: bigint) {
    return await prisma.product.delete({
        where: { id },
    });
}

export async function getProductById(id: bigint) {
    return await prisma.product.findUnique({
        where: { id },
    });
}

export async function getSoldProducts(time: 'Hari' | 'Bulan' | 'Tahun') {
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
    
    const bases = await prisma.productBase.findMany({
        where: {
            products: {
                some: {
                    id: {
                        in: details.map(d => d.productId),
                    },
                },
            },
        },
        select: {
            id: true,
            name: true,
            image: true,
            products: {
                select: {
                    id: true,
                },
            },
        },
    });
    
    const soldProduct = details.map(detail => {
        const product = bases.find(base => base.products.some(product => product.id === detail.productId));
        return {
            id: product?.id.toString(),
            name: product?.name,
            image: product?.image,
            totalQuantity: detail._sum.quantity ?? 0,
        };
    });
    
    return soldProduct;
}