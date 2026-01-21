import { unitMap } from "@/utils/material";
import { MaterialType } from "@prisma/client";
import { ChevronDown } from "lucide-react";

export default function AddMaterialForm() {
    return (
        <>
            <label htmlFor="" className="flex flex-col gap-2 text-xl">
                <span className="font-bold">Nama Bahan Baku</span>
                <input type="text" name="name" id="name" placeholder="Masukkan Nama Bahan Baku" className="opacity-75 p-2 border rounded-md" />
            </label>
            <label htmlFor="type" className="flex flex-col gap-2 text-xl" >
                <span className="font-bold">Satuan Bahan Baku</span>
                <div className="inline-block relative border rounded-md">
                    <select className="px-4 py-2 pr-10 w-full text-xl appearance-none cursor-pointer" defaultValue="" name="type" id="type">
                        <option disabled hidden value="">Pilih Satuan Bahan Baku</option>
                        {
                            Object.values(MaterialType).map((type) => (
                                <option
                                    key={unitMap[type]}
                                    value={type}
                                >
                                    {unitMap[type]}
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
            <label htmlFor="quantity" className="flex flex-col gap-2 text-xl">
                <span className="font-bold">Jumlah Bahan Baku</span>
                <input type="number" name="quantity" id="quantity" placeholder="Masukkan Jumlah Bahan Baku" className="opacity-75 p-2 border rounded-md" />
            </label>
        </>
    );
}