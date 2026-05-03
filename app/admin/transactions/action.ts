"use server";

import { getDetailTransaction } from "@/lib/services/transaction";

export async function getTransactionDetailAction(transactionId: bigint) {
    const data = await getDetailTransaction(transactionId);
    return data ;
}
