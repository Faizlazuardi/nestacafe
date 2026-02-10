"use server"

import { revalidatePath } from "next/cache";
import { MaterialUnit, VariantOption } from "@prisma/client";
import { createProductIngredient, updateProductIngredient, deleteProductIngredient } from "@/lib/services/product.material.service";
import { createProduct, updateProduct, deleteProduct, getSoldProducts, getTotalProducts  } from "@/lib/services/product.service";
import { createProductVariant, updateProductVariant, deleteProductVariant } from "@/lib/services/product.variant.service";
import { createMaterial, deleteMaterial, getTotalMaterials, updateMaterial } from "@/lib/services/material.service";
import { saveImage } from "@/lib/utils/saveImage";
import { createUser, deleteUser, updateUser } from "@/lib/services/user.service";
import { parseTimeRange } from "@/lib/utils/time-range";
import { getTotalRevenue } from "@/lib/services/transaction.service";

type ActionResult = {
    status: string;
    message: string;
};

type EntityAction = (formData: FormData, id?: string) => Promise<ActionResult>;

const actionMap = {
    Produk: {
        POST: (formData) => createProductAction({ formData }),
        PUT: (formData, id) => updateProductAction({ formData, baseId: id! }),
    },
    Varian: {
        POST: (formData) => createProductVariantAction({ formData }),
        PUT: (formData, id) => updateProductVariantAction({ formData, variantId: id! }),
    },
    Komposisi: {
        POST: (formData) => createProductIngredientAction({ formData }),
        PUT: (formData, id) => updateProductIngredientAction({ formData, usageId: id! }),
    },
    "Bahan Baku": {
        POST: (formData) => createMaterialAction({ formData }),
        PUT: (formData, id) => updateMaterialAction({ formData, materialId: id! }),
    },
    Karyawan: {
        POST: (formData) => createEmployeeAction({ formData }),
        PUT: (formData, id) => updateEmployeeAction({ formData, employeeId: id! }),
    },
} satisfies Record<"Produk" | "Varian" | "Komposisi" | "Bahan Baku" | "Karyawan", Record<"POST" | "PUT", EntityAction>>;


export async function submitEntityAction(params: {
    objectName: "Produk" | "Varian" | "Komposisi" | "Bahan Baku" | "Karyawan";
    method: 'POST' | 'PUT';
    id: string;
    formData: FormData;
}) {
    const { objectName, method, id, formData } = params;
    return actionMap[objectName][method](formData, id);
}

const deleteActionMap = {
    Produk: (id: string) => deleteProductAction({ baseId: id }),
    Varian: (id: string) => deleteProductVariantAction({ variantId: id }),
    Komposisi: (id: string) => deleteProductIngredientAction({ usageId: id }),
    "Bahan Baku": (id: string) => deleteMaterialAction({ materialId: id }),
    Karyawan: (id: string) => deleteEmployeeAction({ employeeId: id }),
} satisfies Record<"Produk" | "Varian" | "Komposisi" | "Bahan Baku" | "Karyawan", (id: string) => Promise<ActionResult>>;

export async function deleteEntityAction(params: {
    objectName: "Produk" | "Varian" | "Komposisi" | "Bahan Baku" | "Karyawan";
    id: string;
}) {
    const { objectName, id } = params
    return deleteActionMap[objectName](id);
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
        return { status: "success", message: "Produk berhasil Dibuat" };
    } catch (error: any) {
        return { status:"error", message: error.message };
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
        return { status: "success", message: "Produk Berhasil Diperbarui" };
    } catch (error: any) {
        return { status:"error", message: error.message };
    }
}

export async function deleteProductAction( { baseId }: { baseId: string } ) {
    try {
        const id = BigInt(baseId)
        const deletedProduct = await deleteProduct(id);
        revalidatePath('/admin/products')
        return { status: "success", message: "Produk Berhasil Dihapus" };
    } catch (error: any) {
        return { status:"error", message: error.message };
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
        return { status: "success", message: "Varian Produk Berhasil Dibuat" };
    } catch (error: any) {
        return { status:"error", message: error.message };
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
        return { status: "success", message: "Varian Produk Berhasil Diperbarui" };
    } catch (error: any) {
        return { status:"error", message: error.message };
    }
}

export async function deleteProductVariantAction( { variantId }: { variantId: string } ) {
    try {
        const id = BigInt(variantId)
        const deletedVariant = await deleteProductVariant(id);
        revalidatePath('/admin/products')
        return { status: "success", message: "Varian Produk Berhasil Dihapus" };
    } catch (error: any) {
        return { status:"error", message: error.message };
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
        return { status: "success", message: "Bahan Baku Berhasil Ditambahkan Ke Dalam Produk" };
    } catch (error: any) {
        return { status:"error", message: error.message };
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
        return { status: "success", message: "Bahan Baku Berhasil Diperbarui Di Dalam Produk" };
    } catch (error: any) {
        return { status:"error", message: error.message };
    }
}

export async function deleteProductIngredientAction( { usageId }: {usageId: string } ) {
    try {
        const id = BigInt(usageId)
        const deletedVariant = await deleteProductIngredient(id);
        revalidatePath('/admin/products')
        return { status: "success", message: "Bahan Baku Berhasil Dihapus Dari Produk" };
    } catch (error: any) {
        return { status:"error", message: error.message };
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
        return { status: "success", message: "Bahan Baku Berhasil Ditambahkan" };
    } catch (error: any) {
        return { status:"error", message: error.message };
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
        return { status: "success", message: "Bahan Baku Berhasil Diperbarui" };
    } catch (error: any) {
        return { status:"error", message: error.message };
    }
}

export async function deleteMaterialAction( { materialId }: { materialId: string } ){
    try {
        const id = BigInt(materialId)
        const deletedVariant = await deleteMaterial(id);
        revalidatePath('/admin/materials')
        return { status: "success", message: "Bahan Baku Berhasil Dihapus" };
    } catch (error: any) {
        return { status:"error", message: error.message };
    }
}

export async function createEmployeeAction( { formData }: { formData: FormData } ){
    try {
        const name = formData.get('name') as string
        const password = formData.get('password') as string
        const newUser = await createUser(name, password)
        revalidatePath('/admin/employees')
        return { status: "success", message: "Pengguna Berhasil Ditambahkan" };
    } catch (error: any) {
        return { status:"error", message: error.message};
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
        return { status: "success", message: "Pengguna Berhasil Diperbarui" };
    } catch (error: any) {
        return { status:"error", message: error.message };
    }
}

export async function deleteEmployeeAction( { employeeId }: { employeeId:string } ){
    try {
        const id = BigInt(employeeId)
        const deletedUser = await deleteUser(id);
        revalidatePath('/admin/employees')
        return { status: "success", message: "Pengguna Berhasil Dihapus" };
    } catch (error: any) {
        return { status:"error", message: error.message };
    }
}

export async function getAdminDashboardData(timeParam: string) {
    const time = parseTimeRange(timeParam);
    
    try {
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
    } catch (error: any) {
        return {
            status: "error" as const,
            message: error.message ?? "Failed to load dashboard data",
        };
    }
}