import { getCashierProducts } from "@/services/product.service";

export async function GET(): Promise<Response> {
    try {
        const products = await getCashierProducts();
        return new Response(JSON.stringify(products), { status: 200 });
    } catch (error: any) {
        return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
}