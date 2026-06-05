"use server"

import { createTransaction } from "@/lib/services/transaction";
import { getCashierProducts as fetchCashierProducts, getMaterialStock as fetchMaterialStock } from "@/lib/services/product";
import { CheckoutInput } from "./types";
import { revalidatePath } from "next/cache";

export async function getCashierProducts() {
    return fetchCashierProducts();
}

export async function getMaterialStock(variantIds: bigint[]) {
    return fetchMaterialStock(variantIds);
}

export async function checkoutAction(
    payload: CheckoutInput
) {
    await createTransaction(payload);
    revalidatePath('/admin');
    return {
        status: 'success',
        message: 'Transaction completed successfully. Stock has been updated.',
    };
}