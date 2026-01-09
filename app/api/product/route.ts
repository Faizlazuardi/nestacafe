import { getAllProducts } from "@/services/product.service";

export async function GET(request: Request): Promise<Response> {
    try {
        const { searchParams } = new URL(request.url);
        const withMaterials = searchParams.get("withMaterials") === "true";
        const products = await getAllProducts(withMaterials);
        return new Response(JSON.stringify(products), { status: 200 });
    } catch (error: any) {
        return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
}