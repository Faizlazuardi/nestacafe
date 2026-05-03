"use client"

import { MaterialUsageDetail, Product, ProductVariant } from "@/lib/types/product";
import { Material } from "@/lib/types/material";
import AddButton from "@/app/admin/components/addButton";
import { PencilLine, Trash2 } from "lucide-react";
import VariantList from "./variantList";
import { useState } from "react";
import UpsertModal from "@/app/admin/components/modal/upsertModal";
import { useModals } from "@/hooks/useModals";
import DeleteModal from "../../components/modal/deleteModal";
import { ProductDeleteDetail } from "../../components/modal/deleteDetails/ProductDeleteDetail";
import { VariantDeleteDetail } from "../../components/modal/deleteDetails/VariantDeleteDetail";
import { IngredientDeleteDetail } from "../../components/modal/deleteDetails/IngredientDeleteDetail";
import ProductForm from "../../components/form/productForm";
import VariantForm from "../../components/form/variantForm";
import MaterialUsageForm from "../../components/form/materialUsageForm";
import Image from "next/image";
import { createProductAction, createProductIngredientAction, createProductVariantAction, deleteProductAction, deleteProductIngredientAction, deleteProductVariantAction, updateProductAction, updateProductIngredientAction, updateProductVariantAction } from "../../actions";
import { useRouter } from "next/navigation";

export default function BaseList({ products, materials }: { products: Product[]; materials: Material[] }) {
    const {modals: upsertModal, open: handleOpenUpsertModal, close: handleCloseUpsertModal} = useModals()
    const {modals: deleteModal, open: handleOpenDeleteModal, close: handleCloseDeleteModal} = useModals()
    const [action, setAction] = useState<"POST" | "PUT" | null>(null);
    const [objectName, setObjectName] = useState<'Produk' | 'Varian' | 'Komposisi' | null>(null);
    const [selectedBase, setSelectedBase] = useState<Pick<Product, 'id' | 'name' | 'variants'> | undefined>(undefined);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);
    const [selectedMaterial, setSelectedMaterial] = useState<MaterialUsageDetail | undefined>(undefined);
    const router = useRouter()
    
    const handleSaveEntity = async (initialState: unknown, formData: FormData) => {
        if (!formData) return { data: undefined, error: new Error("No form data") };
        try {
            let result;
            if (objectName === "Produk") {
                if (action === "POST") {
                    result = await createProductAction({ formData });
                } else if (action === "PUT" && selectedBase) {
                    result = await updateProductAction({ baseId: selectedBase.id, formData });
                }
            } else if (objectName === "Varian") {
                if (action === "POST") {
                    result = await createProductVariantAction({ formData });
                } else if (action === "PUT" && selectedVariant) {
                    result = await updateProductVariantAction({ variantId: selectedVariant.id, formData });
                }
            } else if (objectName === "Komposisi") {
                if (action === "POST") {
                    result = await createProductIngredientAction({ formData });
                } else if (action === "PUT" && selectedMaterial) {
                    result = await updateProductIngredientAction({ usageId: selectedMaterial.id, formData });
                }
            };
            router.refresh();
            handleCloseUpsertModal();
            return {
                data: { success: true },
                error: result && "error" in result && result.error instanceof Error ? result.error : null,
            };
        } catch (error) {
            return { data: undefined, error: error instanceof Error ? error : new Error("Save failed") };
        }
    };

    const handleDeleteEntity = async () => {
        if (!objectName) {
            return { data: undefined, error: new Error("No object selected") };
        }
        
        try {
            let result;
            if (objectName === "Produk" && selectedBase) {
                result = await deleteProductAction({ baseId: selectedBase.id });
            } else if (objectName === "Varian" && selectedVariant) {
                result = await deleteProductVariantAction({ variantId: selectedVariant.id });
            } else if (objectName === "Komposisi" && selectedMaterial) {
                result = await deleteProductIngredientAction({ usageId: selectedMaterial.id });
            }
            
            router.refresh();
            handleCloseDeleteModal();
            
            return {
                data: { success: true },
                error: result && "error" in result && result.error instanceof Error ? result.error : null,
            };
        } catch (error) {
            return {
                data: undefined,
                error: error instanceof Error ? error : new Error("Delete failed"),
            };
        }
    };

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
                        handleOpenUpsertModal();
                    }}
                />
            </div>
            {
                products.map((base) => {
                    return (
                        <div key={base.id} className="flex flex-col border border-(--brand-500) rounded-xl w-full">
                            <div className="flex justify-between items-center p-6 rounded-t-xl border-b border-(--brand-500) bg-(--brand-500) text-white">
                                <div className="flex items-center gap-4">
                                    <div className="relative w-16 h-16">
                                        <Image src={base.image} alt="" fill className="object-contain"/>
                                    </div>
                                    <span className="font-bold text-2xl">{base.name}</span>
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => {
                                            setSelectedBase(base);
                                            setObjectName("Produk");
                                            setAction("PUT");
                                            handleOpenUpsertModal();
                                        }}
                                    >
                                        <PencilLine />
                                    </button>
                                    <button onClick={() => {
                                        setSelectedBase(base);
                                        setObjectName("Produk");
                                        handleOpenDeleteModal();
                                    }}>
                                        <Trash2 />
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col gap-6 bg-white p-6 rounded-b-xl">
                                <VariantList
                                    base={base}
                                    variants={base.variants}
                                    onOpenUpsertModal={handleOpenUpsertModal}
                                    onOpenDeleteModal={handleOpenDeleteModal}
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
                upsertModal && objectName && action && (
                    <UpsertModal
                        onCloseModal={handleCloseUpsertModal}
                        handleSaveEntity={handleSaveEntity}
                        placeholder={ 
                            action === "POST" ? (
                                objectName === "Produk" ? "Tambah Produk"
                                : objectName === "Varian" ? "Tambah Varian"
                                : "Tambah Komposisi"
                            ) : 
                            action === "PUT" ? (
                                objectName === "Produk" ? "Edit Produk"
                                : objectName === "Varian" ? "Edit Varian"
                                : "Edit Komposisi"
                            ) : undefined
                        }
                    >
                        { objectName === "Produk" && <ProductForm base={selectedBase} /> }
                        { objectName === "Varian" && <VariantForm base={selectedBase!} variant={selectedVariant} /> }
                        { objectName === "Komposisi" && <MaterialUsageForm base={selectedBase!} variant={selectedVariant!} usage={selectedMaterial} materials={materials} /> }
                    </UpsertModal>
                )
            }
{
                deleteModal && objectName && action && (
                    <DeleteModal
                        objectName={objectName}
                        onCloseModal={handleCloseDeleteModal}
                        handleDeleteEntity={handleDeleteEntity}
                    >
                        {
                            objectName === "Produk" && selectedBase ? <ProductDeleteDetail base={selectedBase} />
                            : objectName === "Varian" && selectedVariant ? <VariantDeleteDetail variant={selectedVariant} />
                            : objectName === "Komposisi" && selectedMaterial ? <IngredientDeleteDetail usage={selectedMaterial} />
                            : undefined
                        }
                    </DeleteModal>
                )
            }
        </>
    )
}