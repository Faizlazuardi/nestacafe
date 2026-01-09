import { Material } from "@/types/material";

export default function UpdateMaterialForm({material}: {material: Material}){
    return (
        <>
            <label className="flex flex-col gap-2 text-xl">
                <span className="font-bold">Nama Produk</span>
                <input type="text" name="name" value={material.name} className="opacity-75 p-2 border rounded-md" readOnly />
            </label>
            <label htmlFor="" className="flex flex-col gap-2 text-xl">
                <span className="font-bold">Jumlah Tambahan Bahan Baku</span>
                <input type="number" name="quantity" id="quantity" placeholder="Masukkan Jumlah Bahan Baku" className="opacity-75 p-2 border rounded-md" />
            </label>
        </>
    )
}