"use server"

import { createTransaction } from "@/lib/services/transaction.service";
import { CheckoutInput } from "./types";
import { revalidatePath } from "next/cache";
import { getCashierProducts } from "@/lib/services/product.service";
import { Product } from "@/lib/types/product";
import { getProductMaterials } from "@/lib/services/product.variant.service";
import { ProductForSale } from "./types";

export async function checkoutAction(
    payload: CheckoutInput
) {
    try {
        await createTransaction(payload);
        revalidatePath('/admin');
        return {
            status: 'success',
            message: 'Transaction completed successfully. Stock has been updated.',
        };
    } catch (error: any) {
        return {
            status: 'error',
            message: error.message,
        };
    }
}

export async function getMaterialsUsedByProducts(products: ProductForSale[]) {
    try {
        const variantIds = products.flatMap(product =>
            product.variants.map(variant => BigInt(variant.id))
        );
        const materials = await getProductMaterials(variantIds)
        return {
            status: 'success',
            data: materials
        }
    } catch (error: any) {
        return {
            status: 'error',
            message: error.message,
        };
    }
}


export async function getProductsForCashier() {
    try {
        const products = await getCashierProducts()
        return {
            status: 'success',
            data: products
        }
    } catch (error: any) {
        return {
            status: 'error',
            message: error.message,
        };
    }
}
