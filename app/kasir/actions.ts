"use server"

import { createTransaction } from "@/lib/services/transaction";
import { CheckoutInput } from "./types";
import { revalidatePath } from "next/cache";

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