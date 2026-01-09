"use client"

import { MaterialUsage, Product, ProductVariant } from "@/types/product";
import { Material } from "@/types/material";
import { useEffect, useRef, useState } from "react";

export default function MaterialUsageForm({
    base,
    variant,
    material
}: {
    base: Pick<Product, 'id' | 'name'>;
    variant: Pick<ProductVariant, 'id' | 'option'>;
    material?: Pick<MaterialUsage, 'id' | 'name'>
}) {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [selectedMaterial, setSelectedMaterial] = useState<Pick<Material, 'id' | 'name'> | null>({id: "", name: ""});
    const [isOpen, setIsOpen] = useState<Boolean>(false)
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchMaterials() {
            try {
                const res = await fetch('/api/material');
                const data = await res.json();
                setMaterials(data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchMaterials();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
            <label className="flex flex-col gap-2 text-xl">
                <span className="font-bold text-xl">Nama Produk</span>
                <input type="text" name="base" value={base!.name} className="opacity-75 p-2 border rounded-md" disabled />
            </label>
            <label className="flex flex-col gap-2 text-xl">
                <span className="font-bold">Varian Produk</span>
                <input type="text" name="variant" value={variant!.option} className="opacity-75 p-2 border rounded-md" disabled />
                <input type="hidden" name="variantId" value={variant!.id} />
            </label>
            <label className="flex flex-col gap-2 text-xl" >
                <span className="font-bold">Nama Bahan Baku</span>
                <div className="relative" ref={dropdownRef}>
                    <input type="hidden" name="materialId" value={selectedMaterial?.id} />
                    <div className="opacity-75 p-2 border rounded-md cursor-pointer" onClick={() => setIsOpen(true)}>
                        {selectedMaterial?.name || "Pilih Nama Bahan Baku"}
                    </div>
                    <ul className={`z-10 absolute bg-white mt-1 border rounded-md w-full max-h-33 overflow-auto ${!isOpen && 'hidden'}`}>
                        {
                            materials.map((material) => (
                                <li
                                    key={material.id}
                                    className="hover:bg-gray-200 p-2 cursor-pointer"
                                    onClick={() => {
                                        setSelectedMaterial(material);
                                        setIsOpen(false)
                                    }}
                                >
                                    {material.name}
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </label>
            <label htmlFor="quantityUsed" className="flex flex-col gap-2 text-xl">
                <span className="font-bold">Jumlah Bahan Baku Digunakan</span>
                <input type="number" name="quantityUsed" id="quantityUsed" placeholder="Masukkan Jumlah Bahan Baku Digunakan" className="opacity-75 p-2 border rounded-md" />
            </label>
        </>
    );
}