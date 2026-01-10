import { NextRequest } from "next/server";
import { getDetailTransaction } from "@/services/transaction.service";

export async function GET(
        request: NextRequest,
        { params }: { params: Promise<{ id: string }> }
    ) {
    const { id } = await params;
    
    if (!id) {
        return Response.json(
        { message: "Transaction ID is required" },
        { status: 400 }
        );
    }
    
    try {
        const transactionId = BigInt(id);
        const transaction = await getDetailTransaction(transactionId);
        return Response.json(transaction);
    } catch (error: any) {
        return Response.json(
        { message: error.message },
        { status: 500 }
        );
    }
}
