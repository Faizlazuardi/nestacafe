import { MaterialType, VariantOption, Material, Product, User } from "@prisma/client";
import { X } from "lucide-react";
import { useRef, useState, useEffect } from "react";

function ProductForm() {
    return (
        <>
            <label htmlFor="" className="flex flex-col gap-2 text-xl">
                <span className="font-bold">Nama Produk</span>
                <input type="text" name="name" id="name" placeholder="Masukkan Nama Produk" className="opacity-75 p-2 border rounded-md"/>
            </label>
            <label htmlFor="" className="flex flex-col gap-2 text-xl">
                <span className="font-bold">Foto Produk</span>
                <input type="file" name="Image" id="" className="opacity-75 p-2 border rounded-md" />
            </label>
            <label htmlFor="" className="flex flex-col gap-2 text-xl">
                <span className="font-bold">Harga Produk</span>
                <input type="text" name="price" id="price" placeholder="Masukkan Harga Produk" className="opacity-75 p-2 border rounded-md"/>
            </label>
        </>
    );
}

function MaterialForm() {
    const [selectedMaterial, setSelectedMaterial] = useState<string>('');
    const [isOpen, setIsOpen] = useState<Boolean>(false)
    const dropdownRef = useRef<HTMLDivElement>(null);
    const unitMap: Record<MaterialType | string, string> = {
        [MaterialType.Solid]: "gram",
        [MaterialType.Liquid]: "ml",
    };

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
                <input type="text" name="name" id="name" placeholder="Masukkan Nama Bahan Baku" className="opacity-75 p-2 border rounded-md"/>
            </label>
            <label htmlFor="type" className="flex flex-col gap-2 text-xl" >
                <span className="font-bold">Satuan Bahan Baku</span>
                <div className="relative" ref={dropdownRef}>
                    <input type="hidden" name="type" value={selectedMaterial}/>
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
                <input type="number" name="quantity" id="quantity" placeholder="Masukkan Jumlah Bahan Baku" className="opacity-75 p-2 border rounded-md"/>
            </label>
        </>
    );
}

function VariantForm() {
    const [selectedVariant, setSelectedVariant] = useState("");
    const [isOpen, setIsOpen] = useState<Boolean>(false)
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    return (
        <label htmlFor="variant" className="flex flex-col gap-2 text-xl" >
            <span className="font-bold">Variant Produk</span>
            <div className="relative" ref={dropdownRef}>
                <input type="hidden" name="variant" value={selectedVariant}/>
                <div className="opacity-75 p-2 border rounded-md cursor-pointer" onClick={() => setIsOpen(true)}>
                    {selectedVariant || "Pilih Tipe Bahan Baku"}
                </div>
                
                <ul className={`z-10 absolute bg-white mt-1 border rounded-md w-full ${!isOpen && 'hidden'}`}>
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
    );
}


function KaryawanForm() {
    return (
        <>
            <label htmlFor="" className="flex flex-col gap-2 text-xl">
                <span className="font-bold">Nama Karyawan</span>
                <input type="text" name="name" id="name" placeholder="Masukkan Nama Karyawan" className="opacity-75 p-2 border rounded-md" />
            </label>
            <label htmlFor="" className="flex flex-col gap-2 text-xl">
                <span className="font-bold">Password</span>
                <input type="password" name="password" id="password" placeholder="Masukkan Password" className="opacity-75 p-2 border rounded-md"/>
            </label>
        </>
    )
}

export default function UpsertModal({ objectName, method, toggleModal }: { objectName: string; method: string; toggleModal: () => void }) {
    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black/20">
            <div className="flex flex-col justify-center bg-white rounded-lg w-fit h-fit">
                <div className="flex items-center gap-50 p-6 border-b">
                    <h1 className="font-bold text-2xl">{method === 'post' ? 'Tambah' : method === "put" ? "Edit" : ""} {objectName}</h1>
                    <X
                        onClick={() => {
                            toggleModal()
                        }}
                    />
                </div>
                <form 
                    action={`/api/admin/${objectName.toLowerCase().replace(' ','-')}/${ method === 'put' ? '[id]' : method === "post" ? '' : null}`} 
                    method={method} 
                    className="flex flex-col gap-4 p-6"
                >
                    {objectName === "Produk" && <ProductForm />}
                    {objectName === "Bahan Baku" && <MaterialForm />}
                    {objectName === "Variant" && <VariantForm />}
                    {objectName === "Karyawan" && <KaryawanForm />}
                    <button type="submit" className="py-2 rounded-lg w-full text-lg button-primary">Simpan</button>
                </form>
            </div>
        </div>
    );
};
