"use client"

import { useActionState } from "react";
import { X } from "lucide-react";
import { MaterialUsage, Product, ProductVariant } from "@/lib/types/product";
import { submitEntityAction } from "@/app/admin/actions";
import ProductForm from "@/app/admin/components/form/productForm";
import VariantForm from "@/app/admin/components/form/variantForm";
import MaterialUsageForm from "@/app/admin/components/form/materialUsageForm";
import AddMaterialForm from "@/app/admin/components/form/addMaterialForm";
import EmployeeForm from "@/app/admin/components/form/employeeForm";
import { useRouter } from "next/navigation";
import UpdateMaterialForm from "../form/updateMaterialForm";
import { Material } from "@/lib/types/material";
import { User } from "@/lib/types/user";

type DeleteModalProps = {
    base?: Pick<Product, "id" | "name" | "variants">;
    variant?: ProductVariant;
    usage?: MaterialUsage;
    material?: Material;
    user?: User;
    objectName: keyof typeof formRender;
    method: 'POST' | 'PUT';
    onCloseModal: () => void;
};

const formRender = {
    Produk: ({ base }: DeleteModalProps) =>
        base ? <ProductForm base={base} /> : null,

    Varian: ({ base, variant }: DeleteModalProps) =>
        variant ? <VariantForm base={base!} variant={variant} /> : null,

    Komposisi: ({ base, variant, usage }: DeleteModalProps) =>
        usage ? <MaterialUsageForm base={base!} variant={variant!} usage={usage} /> : null,

    "Bahan Baku": ({ material, method }: DeleteModalProps) => {
        if (method === "POST") return <AddMaterialForm />;
        if (method === "PUT" && material) return <UpdateMaterialForm material={material} />;
        return null;
    },

    Karyawan: ({ user }: DeleteModalProps) =>
        user ? <EmployeeForm user={user} /> : null,
} as const;

export default function UpsertModal(props: {
    base?: Pick<Product, 'id' | 'name' >;
    variant?: Pick<ProductVariant, 'id' | 'option' | 'price'>;
    usage?: MaterialUsage;
    material?: Material;
    user?: User;
    objectName: 'Produk' | 'Varian' | 'Komposisi' | 'Bahan Baku' | 'Karyawan' | null;
    method: 'POST' | 'PUT';
    onCloseModal: () => void
}) {
    const router = useRouter()
    
    const { base, variant, usage, material, user, objectName, method, onCloseModal } = props;
    const upsertMap = {
        Produk: base?.id,
        Varian: variant?.id,
        Komposisi: usage?.id,
        "Bahan Baku": material?.id,
        Karyawan: user?.id,
    } as const;
    
    const [message, formAction, isPending] = useActionState(
        async(formData: FormData) => {
            if (!objectName) return null;
            const id = upsertMap[objectName];
            if (!id) return null;
            
            const result = await submitEntityAction({
                objectName,
                method,
                id,
                formData,
            });
            
            if (!result.status || result.status === "error") {
                throw new Error(result.message);
            }
            
            router.refresh();
            onCloseModal();
            return result.message;
        }, null
    );

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black/20">
            <div className="flex flex-col justify-center bg-white rounded-lg w-lg h-fit">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b">
                    <h1 className="font-bold text-2xl">
                        {method === 'POST' ? 'Tambah' : method === 'PUT' ? 'Edit' : ''} {objectName}
                    </h1>
                    <X onClick={onCloseModal} />
                </div>
                {/* Content */}
                <form action={formAction} className="flex flex-col gap-6 px-20 py-10">
                    { objectName === "Produk" && <ProductForm base={base} /> }
                    { objectName === "Varian" && <VariantForm base={base!} variant={variant} /> }
                    { objectName === "Komposisi" && <MaterialUsageForm base={base!} variant={variant!} usage={usage} /> }
                    { objectName === "Bahan Baku" && method === "POST" && <AddMaterialForm /> }
                    { objectName === "Bahan Baku" && method === "PUT" && <UpdateMaterialForm material={material!}/> }
                    { objectName === "Karyawan" && <EmployeeForm user={user} /> }
                    <button type="submit" className="py-2 rounded-lg w-full text-lg button-primary" disabled={isPending}>
                        {isPending ? "Menyimpan..." : "Simpan"}
                    </button>
                </form>
            </div>
        </div>
    );
};