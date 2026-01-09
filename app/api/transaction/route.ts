import { createTransaction, getAllTransaction } from "@/services/transaction.service";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const transaction = await getAllTransaction();
        return new Response(JSON.stringify(transaction), { status: 200 });
    } catch (error: any) {
        return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
}

export async function POST(request: Request): Promise<Response> {
    try{
        const data = await request.json();
        const newTransaction = await createTransaction(data);
        const transaction = {
            ...newTransaction,
            id: String(newTransaction.id),
            cashierId: String(newTransaction.cashierId),
        }
        return NextResponse.json(transaction, { status: 200 });
    } catch(error: any) {
        return NextResponse.json(
            { message: error.message },
            { status: 400 }
        );
    }
}