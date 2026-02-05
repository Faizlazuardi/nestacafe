"use server"

import { revalidatePath } from "next/cache";
import { MaterialUnit, VariantOption } from "@prisma/client";
import { createProductIngredient, updateProductIngredient, deleteProductIngredient } from "@/services/product.material.service";
import { createProduct, updateProduct, deleteProduct  } from "@/services/product.service";
import { createProductVariant, updateProductVariant, deleteProductVariant } from "@/services/product.variant.service";
import { createMaterial, deleteMaterial, updateMaterial } from "@/services/material.service";
import { saveImage } from "@/lib/utils/saveImage";
import { createUser, deleteUser, updateUser } from "@/services/user.service";

export async function submitEntityAction(params: {
    objectName: "Produk" | "Varian" | "Komposisi" | "Bahan Baku" | "Karyawan";
    method: 'POST' | 'PUT';
    baseId?: string;
    variantId?: string;
    usageId?: string;
    materialId?: string;
    employeeId?: string;
    formData: FormData;
}) {
    const { objectName, method, baseId, variantId, usageId, materialId, employeeId, formData } = params;

    const actionMap = {
        Produk: {
            POST: () => createProductAction( { formData } ),
            PUT: () => updateProductAction({baseId: baseId!, formData}),
        },
        Varian: {
            POST: () => createProductVariantAction( { formData } ),
            PUT: () => updateProductVariantAction( { variantId: variantId!, formData } ),
        },
        Komposisi: {
            POST: () => createProductIngredientAction( { formData } ),
            PUT: () => updateProductIngredientAction( { usageId: usageId!, formData } ),
        },
        "Bahan Baku": {
            POST: () => createMaterialAction( { formData } ),
            PUT: () => updateMaterialAction( { materialId: materialId!, formData } ),
        },
        Karyawan: {
            POST: () => createEmployeeAction( { formData } ),
            PUT: () => updateEmployeeAction( { employeeId: employeeId!, formData } ),
        },
    } satisfies Record<string, Record<"POST" | "PUT", () => Promise<any>>>;
    await actionMap[objectName][method]();
}

export async function deleteEntityAction(params: {
    objectName: "Produk" | "Varian" | "Komposisi" | "Bahan Baku" | "Karyawan";
    baseId?: string;
    variantId?: string;
    usageId?: string;
    materialId?: string;
    employeeId?: string;
}){
    const { objectName, baseId, variantId, usageId, materialId, employeeId } = params;
    switch (objectName) {
        case "Produk":
            await DeleteProductAction({baseId: baseId!})
            break;
        case "Varian":
            await deleteProductVariantAction({variantId: variantId!})
            break;
        case "Komposisi":
            await deleteProductIngredientAction({usageId: usageId!})
            break;
        case "Bahan Baku":
            await deleteMaterialAction({materialId: materialId!})
            break;
        case "Karyawan":
            await deleteEmployeeAction({employeeId: employeeId!})
            break;
        default:
            break;
    }
}

export async function createProductAction( { formData }: { formData: FormData } ) {
    try {
        const image = formData.get('image') as File;
        if (!(image instanceof File)) {
            throw new Error("Invalid image file");
        }
        
        const imageUrl = await saveImage(image)
        const parsedData = {
            name: formData.get('name') as string,
            image: imageUrl!,
        };
        await createProduct(parsedData);
        revalidatePath('/admin/products')
        return "Produk berhasil Dibuat";
    } catch (error: any) {
        return error.message;
    }
}

export async function updateProductAction( { baseId, formData }: { baseId: string, formData: FormData }) {
    try {
        const id = BigInt(baseId)
        const image = formData.get('image') as File;
        if (!(image instanceof File)) {
            throw new Error("Invalid image file");
        }
        const imageUrl = await saveImage(image)
        const parsedData = {
            name: formData.get('name') as string,
            image: imageUrl,
        };
        const Product = await updateProduct(id, parsedData);
        revalidatePath('/admin/products')
        return "Produk Berhasil Diperbarui";
    } catch (error: any) {
        return error.message;
    }
}

export async function DeleteProductAction( { baseId }: { baseId: string } ) {
    try {
        const id = BigInt(baseId)
        const deletedProduct = await deleteProduct(id);
        revalidatePath('/admin/products')
        return deletedProduct;
    } catch (error: any) {
        return error.message;
    }
}

export async function createProductVariantAction( { formData }: { formData: FormData } ) {
    try {
        const parsedData = {
            baseId: BigInt(formData.get('baseId') as string),
            price: Number(formData.get('price') as string),
            option: formData.get('option') as VariantOption,
        };
        const newVariant = await createProductVariant(parsedData);
        revalidatePath('/admin/products')
        return "Varian Produk Berhasil Dibuat";
    } catch (error: any) {
        return error.message;
    }
}

export async function updateProductVariantAction( { variantId, formData }: { variantId: string, formData: FormData } ) {
    try {
        const id = BigInt(variantId)
        const parsedData = {
            baseId: BigInt(formData.get('baseId') as string),
            price: Number(formData.get('price') as string),
            option: formData.get('option') as VariantOption,
        };
        const newVariant = await updateProductVariant(id, parsedData);
        revalidatePath('/admin/products')
        return "Varian Produk Berhasil Diperbarui";
    } catch (error: any) {
        return error.message;
    }
}

export async function deleteProductVariantAction( { variantId }: { variantId: string } ) {
    try {
        const id = BigInt(variantId)
        const deletedVariant = await deleteProductVariant(id);
        revalidatePath('/admin/products')
        return deletedVariant;
    } catch (error: any) {
        return error.message;
    }
}

export async function createProductIngredientAction( { formData }: { formData: FormData } ) {
    try {
        const parsedData = {
            productId: BigInt(formData.get('variantId') as string),
            materialId: BigInt(formData.get('materialId') as string),
            quantityUsed: Number(formData.get('quantityUsed') as string),
        };
        const newMaterial = await createProductIngredient(parsedData);
        revalidatePath('/admin/products')
        return "Bahan Baku Berhasil Ditambahkan Ke Dalam Produk";
    } catch (error: any) {
        return error.message;
    }
}

export async function updateProductIngredientAction( { usageId, formData }: {usageId: string, formData: FormData} ) {
    try {
        const id = BigInt(usageId)
        const parsedData = {
            productId: BigInt(formData.get('variantId') as string),
            materialId: BigInt(formData.get('materialId') as string),
            quantityUsed: Number(formData.get('quantityUsed') as string),
        };
        const newMaterialUsage = await updateProductIngredient(id, parsedData);
        revalidatePath('/admin/products')
        return "Bahan Baku Berhasil Diperbarui Di Dalam Produk";
    } catch (error: any) {
        return error.message;
    }
}

export async function deleteProductIngredientAction( { usageId }: {usageId: string } ) {
    try {
        const id = BigInt(usageId)
        const deletedVariant = await deleteProductIngredient(id);
        revalidatePath('/admin/products')
        return deletedVariant;
    } catch (error: any) {
        return error.message;
    }
}

export async function createMaterialAction( { formData }: { formData: FormData } ){
    try {
        const parsedData = {
            name: formData.get('name') as string,
            unit: formData.get('unit') as MaterialUnit,
            stock: Number(formData.get('quantity') as string)
        };
        const newMaterial = await createMaterial(parsedData)
        revalidatePath('/admin/materials')
        return "Bahan Baku Berhasil Ditambahkan";
    } catch (error: any) {
        return error.message;
    }
}

export async function updateMaterialAction( { materialId, formData }: { materialId: string, formData: FormData } ){
    try {
        const id = BigInt(materialId)
        const parsedData = {
            quantity: Number(formData.get('quantity') as string)
        };
        const newMaterial = await updateMaterial(BigInt(id), parsedData)
        revalidatePath('/admin/materials')
        return "Bahan Baku Berhasil Diperbarui";
    } catch (error: any) {
        return error.message;
    }
}

export async function deleteMaterialAction( { materialId }: { materialId: string } ){
    try {
        const id = BigInt(materialId)
        const deletedVariant = await deleteMaterial(id);
        revalidatePath('/admin/materials')
        return deletedVariant;
    } catch (error: any) {
        return error.message;
    }
}

export async function createEmployeeAction( { formData }: { formData: FormData } ){
    try {
        const name = formData.get('name') as string
        const password = formData.get('password') as string
        const newUser = await createUser(name, password)
        revalidatePath('/admin/employees')
        return "Pengguna Berhasil Ditambahkan";
    } catch (error: any) {
        return error.message;
    }
}

export async function updateEmployeeAction( { employeeId, formData }: { employeeId: string, formData: FormData } ){
    try {
        const id = BigInt(employeeId)
        const parsedData = {
            name: formData.get('name') as string,
            password: formData.get('password') as string
        };
        const User = await updateUser(BigInt(id), parsedData)
        revalidatePath('/admin/employees')
        return "Pengguna Berhasil Diperbarui";
    } catch (error: any) {
        return error.message;
    }
}

export async function deleteEmployeeAction( { employeeId }: { employeeId:string } ){
    try {
        const id = BigInt(employeeId)
        const deletedUser = await deleteUser(id);
        revalidatePath('/admin/employees')
        return  "Pengguna Berhasil Dihapus";
    } catch (error: any) {
        return error.message;
    }
}