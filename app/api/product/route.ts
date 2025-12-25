import { getAllProducts, createProduct } from "@/services/product.service";

export async function GET(): Promise<Response> {
    try {
        const products = await getAllProducts();
        return new Response(JSON.stringify(products), { status: 200 });
    } catch (error: any) {
        return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
}

export async function POST(request: Request): Promise<Response> {
    const data = await request.json();
    try {
        const newProduct = await createProduct(data);
        return new Response(JSON.stringify(newProduct), { status: 201 });
    } catch (error: any) {
        return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
}