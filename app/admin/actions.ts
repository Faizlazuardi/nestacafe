"use server"

import { revalidatePath } from "next/cache";
import { MaterialUnit, VariantOption } from "@prisma/client";
import { createProductIngredient, updateProductIngredient, deleteProductIngredient } from "@/lib/services/product.material";
import { createProduct, updateProduct, deleteProduct, getSoldProducts, getTotalProducts  } from "@/lib/services/product";
import { createProductVariant, updateProductVariant, deleteProductVariant } from "@/lib/services/product.variant";
import { createMaterial, deleteMaterial, getTotalMaterials, updateMaterial } from "@/lib/services/material";
import { saveImage } from "@/lib/utils/saveImage";
import { createUser, deleteUser, updateUser } from "@/lib/services/user";
import { parseTimeRange } from "@/lib/utils/time-range";
import { getTotalRevenue } from "@/lib/services/transaction";

export async function createProductAction( { formData }: { formData: FormData } ) {
    const image = formData.get('image') as File;
    if (!(image instanceof File)) {
        return new Response("Invalid image file", { status: 400 });
    }
    
    const imageUrl = await saveImage(image)
    const parsedData = {
        name: formData.get('name') as string,
        image: imageUrl!,
    };
    const result = await createProduct(parsedData);
    if (result?.error) {
        return new Response(result.error.message, { status: 500 });
    }
    revalidatePath('/admin/products')
}

export async function updateProductAction( { baseId, formData }: { baseId: string, formData: FormData }) {
    const id = BigInt(baseId)
    const image = formData.get('image') as File;
    if (!(image instanceof File)) {
        return new Response("Invalid image file", { status: 400 });
    }
    const imageUrl = await saveImage(image)
    const parsedData = {
        name: formData.get('name') as string,
        image: imageUrl,
    };
    const result = await updateProduct(id, parsedData);
    if (result.error) {
        return new Response(result.error.message, { status: 500 });
    }
    revalidatePath('/admin/products')
}

export async function deleteProductAction( { baseId }: { baseId: string } ) {
    const id = BigInt(baseId)
    const result = await deleteProduct(id);
    if (result?.error) {
        return new Response(result.error.message, { status: 500 });
    }
    revalidatePath('/admin/products')
}

export async function createProductVariantAction( { formData }: { formData: FormData } ) {
    const parsedData = {
        baseId: BigInt(formData.get('baseId') as string),
        price: Number(formData.get('price') as string),
        option: formData.get('option') as VariantOption,
    };
    const result = await createProductVariant(parsedData);
    if (result?.error) {
        return new Response(result.error.message, { status: 500 });
    }
    revalidatePath('/admin/products')
}

export async function updateProductVariantAction( { variantId, formData }: { variantId: string, formData: FormData } ) {
    const id = BigInt(variantId)
    const parsedData = {
        baseId: BigInt(formData.get('baseId') as string),
        price: Number(formData.get('price') as string),
        option: formData.get('option') as VariantOption,
    };
    const result = await updateProductVariant(id, parsedData);
    if (result?.error) {
        return new Response(result.error.message, { status: 500 });
    }
    revalidatePath('/admin/products')
}

export async function deleteProductVariantAction( { variantId }: { variantId: string } ) {
    const id = BigInt(variantId)
    const result = await deleteProductVariant(id);
    if (result?.error) {
        return new Response(result.error.message, { status: 500 });
    }
    revalidatePath('/admin/products')
}

export async function createProductIngredientAction( { formData }: { formData: FormData } ) {
    const parsedData = {
        productId: BigInt(formData.get('variantId') as string),
        materialId: BigInt(formData.get('materialId') as string),
        quantityUsed: Number(formData.get('quantityUsed') as string),
    };
    const result = await createProductIngredient(parsedData);
    if (result?.error) {
        return new Response(result.error.message, { status: 500 });
    }
    revalidatePath('/admin/products')
}

export async function updateProductIngredientAction( { usageId, formData }: {usageId: string, formData: FormData} ) {
    const id = BigInt(usageId)
    const parsedData = {
        productId: BigInt(formData.get('variantId') as string),
        materialId: BigInt(formData.get('materialId') as string),
        quantityUsed: Number(formData.get('quantityUsed') as string),
    };
    const result = await updateProductIngredient(id, parsedData);
    if (result?.error) {
        return new Response(result.error.message, { status: 500 });
    }
    revalidatePath('/admin/products')
}

export async function deleteProductIngredientAction( { usageId }: {usageId: string } ) {
    const id = BigInt(usageId)
    const result = await deleteProductIngredient(id);
    if (result?.error) {
        return new Response(result.error.message, { status: 500 });
    }
    revalidatePath('/admin/products')
}

export async function createMaterialAction( { formData }: { formData: FormData } ){
    const parsedData = {
        name: formData.get('name') as string,
        unit: formData.get('unit') as MaterialUnit,
        stock: Number(formData.get('quantity') as string)
    };
    const result = await createMaterial(parsedData);
    if (result?.error) {
        return new Response(result.error.message, { status: 500 });
    }
    revalidatePath('/admin/materials')
}

export async function updateMaterialAction( { materialId, formData }: { materialId: string, formData: FormData } ){
    const id = BigInt(materialId)
    const parsedData = {
        quantity: Number(formData.get('quantity') as string)
    };
    const result = await updateMaterial(BigInt(id), parsedData);
    if (result?.error) {
        return new Response(result.error.message, { status: 500 });
    }
    revalidatePath('/admin/materials')
}

export async function deleteMaterialAction( { materialId }: { materialId: string } ){
    const id = BigInt(materialId)
    const result = await deleteMaterial(id);
    if (result?.error) {
        return new Response(result.error.message, { status: 500 });
    }
    revalidatePath('/admin/materials')
}

export async function createEmployeeAction( { formData }: { formData: FormData } ){
    const name = formData.get('name') as string
    const password = formData.get('password') as string
    const result = await createUser(name, password)
    if (result?.error) {
        return new Response(result.error.message, { status: 500 });
    }
    revalidatePath('/admin/employees')
}

export async function updateEmployeeAction( { employeeId, formData }: { employeeId: string, formData: FormData } ){
    const id = BigInt(employeeId)
    const parsedData = {
        name: formData.get('name') as string,
        password: formData.get('password') as string
    };
    const result = await updateUser(id, parsedData)
    if (result?.error) {
        return new Response(result.error.message, { status: 500 });
    }
    revalidatePath('/admin/employees')
}

export async function deleteEmployeeAction( { employeeId }: { employeeId:string } ){
    const id = BigInt(employeeId)
    const result = await deleteUser(id);
    if (result?.error) {
        return new Response(result.error.message, { status: 500 });
    }
    revalidatePath('/admin/employees')
}

export async function getAdminDashboardData(timeParam: string) {
    const time = parseTimeRange(timeParam);
    const [
        products,
        totalProduct,
        totalMaterial,
        totalRevenue,
    ] = await Promise.all([
        getSoldProducts(time),
        getTotalProducts(),
        getTotalMaterials(),
        getTotalRevenue(time),
    ]);

    return {
        data: {
            products,
            summary: {
                product: totalProduct,
                material: totalMaterial,
                revenue: totalRevenue,
            },
        },
    };
}