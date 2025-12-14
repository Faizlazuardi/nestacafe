import prisma from "@/app/lib/prisma";
import { VariantOption } from "@prisma/client";

export async function getAllProducts() {
    try {
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
    } catch (error) {
        console.error("getAllProducts error:", error);
        throw error;
    }
}


export async function createProduct(data: { name: string; price: number, productId:bigint, variant:VariantOption }) {
    return await prisma.product.create({
        data,
    });
}

export async function updateProduct(id: bigint, data: { name: string; price: number, productId:bigint, variant:VariantOption }) {
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