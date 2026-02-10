"use server"

import { getAllTransaction } from "@/lib/services/transaction.service"
import TransactionPage from "./transactionList"

export default async function Page(){
    const transactions = await getAllTransaction()
    return(
        <TransactionPage transactions={transactions}/>
    )
}