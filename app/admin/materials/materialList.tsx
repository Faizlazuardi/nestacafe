"use client"

import { useState } from "react";
import { Trash2 } from "lucide-react";
import UpsertModal from "@/app/admin/components/modal/upsertModal";
import AddButton from "@/app/admin/components/addButton";
import { Material } from "@/types/material";
import { MaterialType } from "@prisma/client";
import { useModals } from "@/hooks/useModals";

function formatQuantity(quantity: number, type: string): string {
    if(quantity < 1000) {
        return `${quantity} ${type == MaterialType.Solid ? "gr" : "ml"}`;
    } else {
        const converted = quantity / 1000;
        return `${converted} ${type == MaterialType.Solid ? "KG" : "L"}`;
    }
}

export default function MaterialList({ materials }: {materials: Material[]}) {
    const {modals: materialModal, open: handleOpenMaterialModal, close: handleCloseMaterialModal} = useModals()
    const [action, setAction] = useState<"PUT" | "POST" | "DELETE" | null>(null);
    const [selectedMaterial, setSelectedMaterial] = useState<Material | undefined>(undefined);
    
    return (
        <>
            <div className="flex justify-between">
                <h1 className="font-bold text-2xl">Bahan Baku</h1>
                <AddButton 
                    objectName="Bahan Baku" 
                    action={()=>{
                        setAction("POST");
                        handleOpenMaterialModal();
                    }}
                />
            </div>
            <div className="flex flex-col gap-4">
                {
                    materials?.map((material) => (
                        <div key={material.id} className="flex justify-between bg-(--brand-50) border-(--brand-500) p-4 rounded-lg border">
                            <div>
                                <h2 className="font-bold text-2xl">{material.name}</h2>
                                <span className="font-semibold text-xl text-(--brand-500)">{formatQuantity(material.quantity, material.type)}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <AddButton 
                                    objectName="Stock" 
                                    action={()=>{
                                        setSelectedMaterial(material)
                                        setAction("PUT");
                                        handleOpenMaterialModal();
                                    }}
                                />
                                <button className="flex items-center gap-2 p-2 rounded-lg w-fit h-fit button-primary">
                                    <Trash2 className="" />
                                </button>
                            </div>
                        </div>
                    ))
                }
            </div>
            {
                materialModal && (
                    <UpsertModal objectName={"Bahan Baku"} method={action} onCloseModal={handleCloseMaterialModal} material={selectedMaterial}/>
                )
            }
        </>
    );
}