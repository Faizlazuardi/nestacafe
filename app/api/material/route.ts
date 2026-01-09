import { getAllMaterials } from "@/services/material.service";

export async function GET() {
    try {
        const materials = await getAllMaterials();
        return new Response(JSON.stringify(materials), { status: 200 });
    } catch (error: any) {
        return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
}