"use client"

import { useState } from "react";
import { Trash2 } from "lucide-react";
import UpsertModal from "@/app/admin/components/modal/upsertModal";
import AddButton from "@/app/admin/components/addButton";
import { Material } from "@/lib/types/material";
import { MaterialUnit } from "@prisma/client";
import { useModals } from "@/hooks/useModals";
import DeleteModal from "../components/modal/deleteModal";
import { UpdateMaterialForm, AddMaterialForm } from "../components/form/materialForm";
import { createMaterialAction, deleteMaterialAction, updateMaterialAction } from "../actions";
import { MaterialDeleteDetail } from "../components/modal/deleteDetails/MaterialDeleteDetail";
import { useRouter } from "next/navigation";

function formatQuantity(quantity: number, unit: string): string {
    if(quantity < 1000) {
        return `${quantity} ${unit == MaterialUnit.GRAM ? "gr" : "ml"}`;
    } else {
        const converted = quantity / 1000;
        return `${converted} ${unit == MaterialUnit.GRAM ? "KG" : "L"}`;
    }
}

export default function MaterialList({ materials }: {materials: Material[]}) {
    const {modals: upsertModal, open: handleOpenUpsertModal, close: handleCloseUpsertModal} = useModals()
    const {modals: deleteModal, open: handleOpenDeleteModal, close: handleCloseDeleteModal} = useModals()
    const [action, setAction] = useState<"PUT" | "POST" | null>(null);
    const [selectedMaterial, setSelectedMaterial] = useState<Material | undefined>(undefined);
    const router = useRouter()

const handleSaveEntity = async (initialState: unknown, formData: FormData) => {
        if (!formData) return { data: undefined, error: new Error("No form data") };
        try {
            if (action === "POST") {
                await createMaterialAction({ formData });
            } else if (action === "PUT" && selectedMaterial) {
                await updateMaterialAction({ materialId: selectedMaterial.id.toString(), formData });
            }
            router.refresh();
            handleCloseUpsertModal();
            return { data: { success: true }, error: null };
        } catch (error) {
            return { data: undefined, error: error instanceof Error ? error : new Error("Save failed") };
        }
    };

const handleDeleteEntity = async () => {
        if (!selectedMaterial) {
            return { data: undefined, error: new Error("No material selected") };
        }
        
        try {
            await deleteMaterialAction({ materialId: selectedMaterial.id.toString() });
            
            router.refresh();
            handleCloseDeleteModal();
            
            return {
                data: { id: selectedMaterial.id, objectName: "Bahan Baku" },
                error: null,
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
            <div className="flex justify-between">
                <h1 className="font-bold text-2xl">Bahan Baku</h1>
                <AddButton 
                    objectName="Bahan Baku" 
                    action={()=>{
                        setAction("POST");
                        handleOpenUpsertModal();
                    }}
                />
            </div>
            <div className="flex flex-col gap-4">
                {
                    materials?.map((material) => (
                        <div key={material.id} className="flex justify-between bg-(--brand-50) border-(--brand-500) p-4 rounded-lg border">
                            <div>
                                <h2 className="font-bold text-2xl">{material.name}</h2>
                                <span className="font-semibold text-xl text-(--brand-500)">{formatQuantity(material.stock, material.unit)}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <AddButton 
                                    objectName="Stock" 
                                    action={()=>{
                                        setSelectedMaterial(material)
                                        setAction("PUT");
                                        handleOpenUpsertModal();
                                    }}
                                />
                                <button onClick={() => {
                                    setSelectedMaterial(material);
                                    handleOpenDeleteModal();
                                }}>
                                    <Trash2 className="flex items-center gap-2 p-2 rounded-lg w-fit h-fit button-primary"/>
                                </button>
                            </div>
                        </div>
                    ))
                }
            </div>
            {
                upsertModal && (
                    <UpsertModal 
                        onCloseModal={handleCloseUpsertModal}
                        handleSaveEntity={handleSaveEntity}
                        placeholder={
                            action === "POST" ? "Tambah Bahan Baku" : 
                            `Update ${selectedMaterial?.name}`}
                    >
                        { action === "POST" && <AddMaterialForm /> }
                        { action === "PUT" && <UpdateMaterialForm material={selectedMaterial!}/> }
                    </UpsertModal>
                )
            }
{
                deleteModal && selectedMaterial && (
                    <DeleteModal 
                        objectName="Bahan Baku" 
                        onCloseModal={handleCloseDeleteModal}
                        handleDeleteEntity={handleDeleteEntity}
                    >
                        <MaterialDeleteDetail material={selectedMaterial} />
                    </DeleteModal>
                )
            }
        </>
    );
}