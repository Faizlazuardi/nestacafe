"use client"

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Material } from "@prisma/client";
import UpsertModal from "@/app/components/admin/upsertModal";
import AddButton from "@/app/components/admin/addButton";

function formatQuantity(quantity: number, type: string): string {
    if(quantity < 1000) {
        return `${quantity} ${type === "granular" ? "gr" : "ml"}`;
    } else {
        const converted = quantity / 1000;
        return `${converted} ${type === "granular" ? "Kg" : "L"}`;
    }
}

export default function materialPage() {
    type MaterialListItem = Pick<Material, "id" | "name" | "type" | "quantity">;
    const [materials, setMaterials] = useState<MaterialListItem[]>([]);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [action, setAction] = useState<string>("");
    
    useEffect(() => {
        async function fetchMaterials() {
            try {
                const res = await fetch('/api/admin/bahan-baku');
                const data = await res.json();
                setMaterials(
                    data.map((item: any) => ({
                        ...item,
                        id: BigInt(item.id)
                    }))
                );
            } catch (error) {
                console.error(error);
            }
        }
        
        fetchMaterials();
    }, []);
    
    const toggleModal = ():void => {
        setIsOpen(!isOpen);
    }
    
    return (
        <>
            <div className="flex justify-between">
                <h1 className="font-bold text-2xl">Bahan Baku</h1>
                <AddButton 
                    objectName="Bahan Baku" 
                    action={()=>{
                        setAction("post");
                        toggleModal();
                    }}
                />
            </div>
            <div className="flex flex-col gap-4 overflow-y-scroll">
                {
                    materials?.map((material) => (
                        <div key={material.id} className="flex justify-between bg-gray-100 p-4 rounded-lg stock">
                            <div>
                                <h2 className="font-semibold">{material.name}</h2>
                                <span>{formatQuantity(material.quantity, material.type)}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <AddButton 
                                    objectName="Stock" 
                                    action={()=>{
                                        setAction("post");
                                        toggleModal();
                                    }}
                                />
                                <button className="flex items-center gap-2 p-2 rounded-lg w-fit h-fit button-secondary">
                                    <Trash2 className="" />
                                </button>
                            </div>
                        </div>
                    ))
                }
            </div>
            {
                isOpen && (
                    <UpsertModal objectName={"Bahan Baku"} method={action} toggleModal={toggleModal}/>
                )
            }
        </>
    );
}
