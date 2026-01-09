"use client"
import { unitMap } from "@/utils/material";
import { MaterialType } from "@prisma/client";
import { useEffect, useRef, useState } from "react";

export default function AddMaterialForm() {
    const [selectedMaterial, setSelectedMaterial] = useState<string>('');
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
            <label htmlFor="" className="flex flex-col gap-2 text-xl">
                <span className="font-bold">Nama Bahan Baku</span>
                <input type="text" name="name" id="name" placeholder="Masukkan Nama Bahan Baku" className="opacity-75 p-2 border rounded-md" />
            </label>
            <label htmlFor="type" className="flex flex-col gap-2 text-xl" >
                <span className="font-bold">Satuan Bahan Baku</span>
                <div className="relative" ref={dropdownRef}>
                    <input type="hidden" name="type" value={selectedMaterial} />
                    <div className="opacity-75 p-2 border rounded-md cursor-pointer" onClick={() => setIsOpen(true)}>
                        {unitMap[selectedMaterial] || "Pilih Satuan Bahan Baku"}
                    </div>
                    <ul className={`z-10 absolute bg-white mt-1 border rounded-md w-full ${!isOpen && 'hidden'}`}>
                        {
                            Object.values(MaterialType).map((type) => (
                                <li
                                    key={type}
                                    className="hover:bg-gray-200 p-2 cursor-pointer"
                                    onClick={() => {
                                        setSelectedMaterial(type)
                                        setIsOpen(false)
                                    }}
                                >
                                    {unitMap[type]}
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </label>
            <label htmlFor="" className="flex flex-col gap-2 text-xl">
                <span className="font-bold">Jumlah Bahan Baku</span>
                <input type="number" name="quantity" id="quantity" placeholder="Masukkan Jumlah Bahan Baku" className="opacity-75 p-2 border rounded-md" />
            </label>
        </>
    );
}