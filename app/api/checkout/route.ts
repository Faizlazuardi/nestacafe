import { PrinterService } from "@/services/printer.service";
import { createTransaction } from "@/services/transaction.service";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<Response> {
    try{
        const data = await request.json();
        
        await createTransaction(data);
        // const printer = new PrinterService();
        // await printer.printReceipt(data);
        
        return NextResponse.json("Transaction completed successfully. Stock has been updated.", { status: 200 });
    } catch(error: any) {
        return NextResponse.json(
            { message: error.message },
            { status: 400 }
        );
    }
}