"use client"

import { Material } from "@/types/material";
import { MaterialUsage, Product, ProductVariant } from "@/types/product";
import { User } from "@/types/user";
import { TriangleAlert, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteEntityAction } from "@/app/admin/actions";
import { formatIDR } from "@/utils/formatIDR";

export default function DeleteModal({ base, variant, usage, material, user, objectName, onCloseModal }: 
    {
    base?: Pick<Product, 'id' | 'name' | 'variants'>;
    variant?: ProductVariant;
    usage?: MaterialUsage;
    material?: Material;
    user?: User;
    objectName: 'Produk' | 'Varian' | 'Komposisi' | 'Bahan Baku' | 'Karyawan' | null;
    onCloseModal: () => void
}) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition();
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        startTransition(() => {
            deleteEntityAction({
                objectName: objectName!,
                baseId: base?.id,
                variantId: variant?.id,
                usageId: usage?.id,
                materialId: material?.id,
                employeeId: user?.id
            }).then(() => {
                router.refresh();
                onCloseModal();
            });
        });
    };
    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black/20">
            <div className="flex flex-col justify-center bg-white rounded-lg w-xl h-fit">
                <div className="flex justify-between p-6 bg-(--brand-500) text-gray-100 items-center rounded-t-lg">
                    <span className="text-2xl">Hapus {objectName}</span>
                    <X className="w-fit h-full" onClick={onCloseModal}/>
                </div>
                <div className="flex flex-col gap-4 p-6">
                    <div className=" flex items-center p-4 text-(--brand-500) border border-(--brand-500) gap-4 bg-(--brand-50) rounded-lg">
                        <TriangleAlert/>
                        <span className="text-lg">Data yang akan di hapus tidak dapat dikembalikan</span>
                    </div>
                    <div className="flex flex-col gap-4">
                        { objectName === "Produk" && <ProductDetail base={base!} /> }
                        { objectName === "Varian" && <VariantDetail variant={variant!} /> }
                        { objectName === "Komposisi" && <IngredientDetail usage={usage!} /> }
                        { objectName === "Bahan Baku" && <MaterialDetail material={material!} /> }
                        { objectName === "Karyawan" && <EmployeeDetail user={user!} /> }
                    </div>
                    <div className="flex gap-6 w-full">
                        <button
                            className="px-6 py-3 rounded-md w-full hover:cursor-pointer button-secondary"
                            onClick={onCloseModal}
                        >
                            Batal
                        </button>
                        <form className="w-full" onSubmit={handleSubmit} method="post">
                            <button type="submit" className="px-6 py-3 rounded-lg w-full text-lg button-primary" disabled={isPending}>
                                {isPending ? "Menghapus..." : "Hapus"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ProductDetail({ base }: {
    base: Pick<Product, 'id' | 'name' | 'variants'>;
}){
    return(
        <>
            <div className="flex flex-col gap-4 p-4 border border-(--brand-500) rounded-lg bg-(--brand-50)">
                <span className="font-bold text-lg">Detail Produk yang akan dihapus</span>
                <div className="inline-flex gap-6 w-full">
                    <div className="flex flex-col w-1/2">
                        <span>Nama Produk</span>
                        <span className="font-semibold">{base.name}</span>
                    </div>
                    <div className="flex flex-col w-1/2">
                        <span>Jumlah Varian:</span>
                        <span className="font-semibold">{base.variants.length} Varian</span>
                    </div>
                </div>
            </div>
            {
                base.variants.length !== 0 && (
                    <div className="flex flex-col gap-2 bg-(--brand-50) p-4 border border-(--brand-500) rounded-lg">
                        <span className="font-semibold text-lg">Detail Varian yang akan dihapus</span>
                        {
                            base?.variants.map(variant => (
                                <div key={variant.id} className="flex flex-col gap-2 bg-gray-50 p-4 rounded-md">
                                    <span className="">
                                        <b>{variant.option}</b> {formatIDR(variant.price)}
                                    </span>
                                    <div className="flex flex-col gap-1">
                                        <span>Bahan Baku:</span>
                                        <div className="flex flex-col">
                                            {
                                                variant.materials?.map(usage => (
                                                    <ul key={usage.id} className="">
                                                        <li className="list-disc list-inside">{usage.name} ({usage.quantityUsed} {usage.unit.toLocaleLowerCase()})</li>
                                                    </ul>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                )
            }
        </>
    )
}

function VariantDetail({ variant }: {
    variant:ProductVariant;
}){
    return(
        <>
            <div className="flex flex-col gap-4 p-4 border border-(--brand-500) rounded-lg bg-(--brand-50)">
                <span className="font-bold text-lg">Detail Varian yang akan dihapus</span>
                {
                    <div className="inline-flex gap-6 w-full">
                        <div className="flex flex-col w-1/2">
                            <span>Opsi Varian</span>
                            <span className="font-semibold">{variant.option}</span>
                        </div>
                        <div className="flex flex-col w-1/2">
                            <span>Harga Varian</span>
                            <span className="font-semibold">{formatIDR(variant.price)}</span>
                        </div>
                    </div>
                }
            </div>
            {
                variant.materials!.length !== 0 && (
                    <div className="flex flex-col gap-2 bg-(--brand-50) p-4 border border-(--brand-500) rounded-lg">
                        <span className="font-semibold text-lg">Bahan Baku yang digunakan pada varian ini:</span>
                        <div className="flex flex-col gap-2 bg-gray-50 p-4 rounded-md">
                            {
                                variant.materials?.map(usage => (
                                    <ul key={usage.id} className="">
                                        <li className="list-disc list-inside">{usage.name} - {usage.quantityUsed} {usage.unit.toLocaleLowerCase()}</li>
                                    </ul>
                                ))
                            }
                        </div>
                    </div>
                )
            }
        </>
    )
}

function IngredientDetail({ usage }: {
    usage: MaterialUsage;
}){
    return(
        <div className="flex flex-col gap-4 p-4 border border-(--brand-500) rounded-lg bg-(--brand-50)">
            <span className="font-bold text-lg">Detail Bahan baku yang akan dihapus</span>
            {
                <div className="inline-flex gap-6 w-full">
                    <div className="flex flex-col w-1/2">
                        <span>Nama Bahan Baku</span>
                        <span className="font-semibold">{usage.name}</span>
                    </div>
                    <div className="flex flex-col w-1/2">
                        <span>Jumlah yang digunakan</span>
                        <span className="font-semibold">{usage.quantityUsed} {usage.unit.toLocaleLowerCase()}</span>
                    </div>
                </div>
            }
        </div>
    )
}

function MaterialDetail({ material }:{
    material: Material
}){
    return(
        <div className="flex flex-col gap-4 p-4 border border-(--brand-500) rounded-lg bg-(--brand-50)">
            <span className="font-bold text-lg">Detail Bahan baku yang akan dihapus</span>
            {
                <div className="inline-flex gap-6 w-full">
                    <div className="flex flex-col w-1/2">
                        <span>Nama Bahan Baku</span>
                        <span className="font-semibold">{material.name}</span>
                    </div>
                    <div className="flex flex-col w-1/2">
                        <span>Stok Bahan Baku</span>
                        <span className="font-semibold">{material.stock} {material.unit.toLocaleLowerCase()}</span>
                    </div>
                </div>
            }
        </div>
    )
}

function EmployeeDetail({ user }: { user: User }){
    return(
        <>
            <div className="flex flex-col gap-4 p-4 border border-(--brand-500) rounded-lg bg-(--brand-50)">
                <span className="font-bold text-lg">Detail Karyawan yang akan dihapus</span>
                {
                    <div className="inline-flex gap-6 w-full">
                        <div className="flex flex-col w-1/2">
                            <span>Nama Karyawan</span>
                            <span className="font-semibold">{user.name}</span>
                        </div>
                        <div className="flex flex-col w-1/2">
                            <span>Role Karyawan</span>
                            <span className="font-semibold">{user.role}</span>
                        </div>
                    </div>
                }
            </div>
        </>
    )
}