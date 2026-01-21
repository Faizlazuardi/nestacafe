"use client"

import { MaterialUsage, Product, ProductVariant } from "@/types/product";
import { Material } from "@/types/material";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

export default function MaterialUsageForm({
    base,
    variant,
    usage
}: {
    base: Pick<Product, 'id' | 'name'>;
    variant: Pick<ProductVariant, 'id' | 'option'>;
    usage?: MaterialUsage
}) {
    const [materials, setMaterials] = useState<Material[]>([]);

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
                <div className="inline-block relative border rounded-md">
                    <select
                        className="px-4 py-2 pr-10 w-full max-h-33 overflow-auto text-xl appearance-none cursor-pointer"
                        name="materialId"
                        defaultValue={usage?.type ?? ""}
                    >
                        <option disabled hidden value="">Pilih Nama Bahan Baku</option>
                        {
                            Object.values(materials).map((material) => (
                                <option
                                    key={material.id}
                                    value={material.id}
                                >
                                    {material.name}
                                </option>
                            ))
                        }
                    </select>

                    <ChevronDown
                        size={20}
                        className="top-1/2 right-2 absolute text-gray-500 -translate-y-1/2 pointer-events-none"
                    />
                </div>
            </label>
            <label htmlFor="quantityUsed" className="flex flex-col gap-2 text-xl">
                <span className="font-bold">Jumlah Bahan Baku Digunakan</span>
                <input type="number" name="quantityUsed" id="quantityUsed" placeholder="Masukkan Jumlah Bahan Baku Digunakan" value={usage?.quantityUsed} className="opacity-75 p-2 border rounded-md" />
            </label>
        </>
    );
}