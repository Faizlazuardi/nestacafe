import { getAllTransaction } from "@/services/transaction.service";

export async function GET() {
    try {
        const transaction = await getAllTransaction();
        return new Response(JSON.stringify(transaction), { status: 200 });
    } catch (error: any) {
        return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
}