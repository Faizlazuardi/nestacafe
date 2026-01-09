"use client"

import { MaterialUsage, Product, ProductVariant } from "@/types/product";
import AddButton from "@/app/admin/components/addButton";
import { PencilLine, Trash2 } from "lucide-react";
import VariantList from "./variantList";
import { useState } from "react";
import UpsertModal from "@/app/admin/components/modal/upsertModal";
import { useModals } from "@/hooks/useModals";

export default function BaseList({ products }: { products: Product[]}) {
    const {modals: productModal, open: handleOpenProductModal, close: handleCloseProductModal} = useModals()
    const [action, setAction] = useState<"POST" | "PUT" | "DELETE" | null>(null);
    const [objectName, setObjectName] = useState<'Produk' | 'Varian' | 'Komposisi' | 'Bahan Baku' | 'Karyawan' | null>(null);
    const [selectedBase, setSelectedBase] = useState<Pick<Product, 'id' | 'name'> | undefined>(undefined);
    const [selectedVariant, setSelectedVariant] = useState<Pick<ProductVariant, 'id' | 'option' | 'price'> | undefined>(undefined);
    const [selectedMaterial, setSelectedMaterial] = useState<MaterialUsage | undefined>(undefined);
    ;
    
    return (
        <>
            <div className="flex justify-between items-center">
                <h1 className="font-bold text-2xl">Produk</h1>
                <AddButton
                    objectName="Produk"
                    action={() => {
                        setSelectedBase(undefined);
                        setObjectName("Produk");
                        setAction("POST");
                        handleOpenProductModal();
                    }}
                />
            </div>
            {
                products.map((base) => {
                    return (
                        <div key={base.id} className="flex flex-col border border-(--brand-500) rounded-xl w-full">
                            <div className="flex justify-between items-center p-6 bg-(--brand-50) border-b border-(--brand-500) rounded-t-xl">
                                <div className="flex items-center gap-4 h-16">
                                    <img src={base.image} alt="" className="w-fit h-full" />
                                    <span className="font-bold text-2xl">{base.name}</span>
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => {
                                            setSelectedBase(base);
                                            setObjectName("Produk");
                                            setAction("PUT");
                                            handleOpenProductModal();
                                        }}
                                    >
                                        <PencilLine />
                                    </button>
                                    <button onClick={() => {
                                        setAction("DELETE");
                                    }}>
                                        <Trash2 />
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col gap-6 bg-white p-6 rounded-b-xl">
                                <VariantList
                                    base={base}
                                    variants={base.variants}
                                    onOpenProductModal={handleOpenProductModal}
                                    setAction={setAction}
                                    setObjectName={setObjectName}
                                    setSelectedBase={setSelectedBase}
                                    setSelectedVariant={setSelectedVariant}
                                    setSelectedMaterial={setSelectedMaterial}
                                />
                            </div>
                        </div>
                    )
                })
            }
            {
                productModal && (
                    <UpsertModal
                        base={selectedBase}
                        variant={selectedVariant}
                        usage={selectedMaterial}
                        objectName={objectName}
                        method={action}
                        onCloseModal={handleCloseProductModal}
                    />
                )
            }
        </>
    )
}