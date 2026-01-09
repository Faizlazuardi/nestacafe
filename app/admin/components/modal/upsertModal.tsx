"use client"

import { useTransition } from "react";
import { X } from "lucide-react";
import { MaterialUsage, Product, ProductVariant } from "@/types/product";
import { submitEntityAction } from "@/app/admin/actions";
import ProductForm from "@/app/admin/components/form/productForm";
import VariantForm from "@/app/admin/components/form/variantForm";
import MaterialUsageForm from "@/app/admin/components/form/materialUsageForm";
import AddMaterialForm from "@/app/admin/components/form/addMaterialForm";
import EmployeeForm from "@/app/admin/components/form/employeeForm";
import { useRouter } from "next/navigation";
import UpdateMaterialForm from "../form/updateMaterialForm";
import { Material } from "@/types/material";
import { User } from "@/types/user";

export default function UpsertModal({
    base,
    variant,
    usage,
    material,
    user,
    objectName,
    method,
    onCloseModal
}: {
    base?: Pick<Product, 'id' | 'name'>;
    variant?: Pick<ProductVariant, 'id' | 'option' | 'price'>;
    usage?: Pick<MaterialUsage, 'id' | 'name'>;
    material?: Material;
    user?: User;
    objectName: 'Produk' | 'Varian' | 'Komposisi' | 'Bahan Baku' | 'Karyawan' | null;
    method: 'POST' | 'PUT' | 'DELETE' | null;
    onCloseModal: () => void
}) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition();
        const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        startTransition(() => {
            submitEntityAction({
                objectName: objectName!,
                method: method as "POST" | "PUT",
                baseId: base?.id,
                variantId: variant?.id,
                usageId: usage?.id,
                materialId: material?.id,
                employeeId: user?.id,
                formData,
            }).then(() => {
                router.refresh();
                onCloseModal();
            });
        });
    };
    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black/20">
            <div className="flex flex-col justify-center bg-white rounded-lg w-lg h-fit">
                <div className="flex justify-between items-center p-6 border-b">
                    <h1 className="font-bold text-2xl">
                        {method === 'POST' ? 'Tambah' : method === 'PUT' ? 'Edit' : ''} {objectName}
                    </h1>
                    <X onClick={onCloseModal} />
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-6 px-20 py-10">
                    {objectName === "Produk" && <ProductForm base={base} />}
                    {objectName === "Varian" && <VariantForm base={base!} variant={variant} />}
                    {objectName === "Komposisi" && <MaterialUsageForm base={base!} variant={variant!} material={usage} />}
                    {objectName === "Bahan Baku" && method === "POST" && <AddMaterialForm />}
                    {objectName === "Bahan Baku" && method === "PUT" && <UpdateMaterialForm material={material!}/>}
                    {objectName === "Karyawan" && <EmployeeForm user={user} />}
                    <button type="submit" className="py-2 rounded-lg w-full text-lg button-primary" disabled={isPending}>
                        {isPending ? "Menyimpan..." : "Simpan"}
                    </button>
                </form>
            </div>
        </div>
    );
};