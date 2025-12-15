import { createMaterial, getAllMaterials } from "@/app/service/material.service";
import { MaterialType } from "@prisma/client";

export async function GET(): Promise<Response> {
    try {
        const material = await getAllMaterials();
        return new Response(JSON.stringify(material), { status: 200 });
    } catch (error: any) {
        return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
}

export async function POST(req: Request): Promise<Response> {
    const form = await req.formData();
    
    const name = form.get("name")?.toString();
    
    const typeValue = form.get("type")?.toString();
    const type = Object.values(MaterialType).find(
        (val) => val === typeValue
    ) as MaterialType | undefined;
    
    const quantity: number = Number(form.get("quantity"));

    if (!name || !type || isNaN(quantity)) {
        return new Response(
            JSON.stringify({ message: "Invalid form data" }),
            { status: 400 }
        );
    }
    
    const data = {
        name: name,
        type: type,
        quantity: quantity
    }
    
    try {
        await createMaterial(data);
        return new Response(JSON.stringify({message: data}), { status: 201 });
    } catch (error: any) {
        return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
}