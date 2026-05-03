"use server"

import { getAllTransaction } from "@/lib/services/transaction"
import TransactionPage from "./transactionList"

export default async function Page(){
    const transactions = await getAllTransaction()
    return(
        <TransactionPage transactions={transactions}/>
    )
}