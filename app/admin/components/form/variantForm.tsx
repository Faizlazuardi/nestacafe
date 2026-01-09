"use client"

import { Product, ProductVariant } from "@/types/product";
import { VariantOption } from "@prisma/client";
import { useEffect, useRef, useState } from "react";

export default function VariantForm({
    base,
    variant
}: {
    base: Pick<Product, 'id' | 'name'>;
    variant?: Pick<ProductVariant,'id' | 'option' | 'price'>;
}) {
    const [selectedVariant, setSelectedVariant] = useState<string>(variant?.option ?? "");
    const [isOpen, setIsOpen] = useState<Boolean>(false)
    const dropdownRef = useRef<HTMLDivElement>(null);

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
                <span className="font-bold">Nama Produk</span>
                <input type="text" name="base" value={base.name} className="opacity-75 p-2 border rounded-md" disabled />
                <input type="hidden" name="baseId" value={base.id} />
            </label>
            <label className="flex flex-col gap-2 text-xl" >
                <span className="font-bold">Variant Produk</span>
                <div className="relative" ref={dropdownRef}>
                    <input type="hidden" name="option" value={selectedVariant} />
                    <div className="opacity-75 p-2 border rounded-md cursor-pointer" onClick={() => setIsOpen(true)}>
                        {selectedVariant || "Pilih Tipe Bahan Baku"}
                    </div>
                    <ul className={`z-10 absolute bg-white mt-1 border rounded-md w-full h-33 overflow-auto ${!isOpen && 'hidden'}`}>
                        {
                            Object.values(VariantOption).map((type) => (
                                <li
                                    key={type}
                                    className="hover:bg-gray-200 p-2 cursor-pointer"
                                    onClick={() => {
                                        setSelectedVariant(type)
                                        setIsOpen(false)
                                    }}
                                >
                                    {type}
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </label>
            <label htmlFor="price" className="flex flex-col gap-2 text-xl">
                <span className="font-bold">Harga Produk</span>
                <input type="number" name="price" id="price" defaultValue={variant?.price} placeholder="Masukkan Harga Produk" className="opacity-75 p-2 border rounded-md" />
            </label>
        </>
    );
}