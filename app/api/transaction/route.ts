import { createTransaction } from "@/services/transaction.service";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<Response> {
    try{
        const data = await request.json();
        const newTransaction = await createTransaction(data);
        const transaction = {
            ...newTransaction,
            id: newTransaction.id.toString(),
            cashierId: newTransaction.cashierId.toString(),
        }
        return NextResponse.json(transaction, { status: 200 });
    } catch(error: any) {
        return NextResponse.json(
            { message: error.message },
            { status: 400 }
        );
    }
}