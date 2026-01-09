import { getDetailTransaction } from "@/services/transaction.service";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = await params;
        const transactionId = BigInt(id)
        const transaction = await getDetailTransaction(transactionId);
        return Response.json(transaction);
    } catch (error: any) {
        return Response.json(
        { message: error.message },
        { status: 500 }
        );
    }
}
