import { deleteMaterial, updateMaterial } from "@/app/service/material.service";

export async function PUT(request: Request): Promise<Response> {
    const { id, ...data } = await request.json();
    try {
        const updatedProduct = await updateMaterial(id, data);
        return new Response(JSON.stringify(updatedProduct), { status: 200 });
    } catch (error: any) {
        return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
}

export async function DELETE(request: Request): Promise<Response> {
    const { id } = await request.json();
    try {
        const deletedProduct = await deleteMaterial(id);
        return new Response(JSON.stringify(deletedProduct), { status: 200 });
    } catch (error: any) {
        return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
}