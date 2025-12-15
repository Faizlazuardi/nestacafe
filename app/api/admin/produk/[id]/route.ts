import { getProductById, updateProduct, deleteProduct,  } from "@/app/service/product.service";

export async function GET(request: Request, { params }: { params: { id: bigint } }): Promise<Response> {
    const id:bigint = params.id
    try {
        const product = await getProductById(id);
        if (product) {
            return new Response(JSON.stringify(product), { status: 200 });
        }
        return new Response(JSON.stringify({ message: "Product not found" }), { status: 404 });
    } catch (error: any) {
        return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
}

export async function PUT(request: Request): Promise<Response> {
    const { id, ...data } = await request.json();
    try {
        const updatedProduct = await updateProduct(id, data);
        return new Response(JSON.stringify(updatedProduct), { status: 200 });
    } catch (error: any) {
        return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
}

export async function DELETE(request: Request): Promise<Response> {
    const { id } = await request.json();
    try {
        const deletedProduct = await deleteProduct(id);
        return new Response(JSON.stringify(deletedProduct), { status: 200 });
    } catch (error: any) {
        return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
}