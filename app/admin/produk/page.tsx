"use client"

import { useEffect, useState } from "react";
import { PencilLine, Trash2 } from "lucide-react"
import UpsertModal from "@/app/components/admin/upsertModal";
import AddButton from "@/app/components/admin/addButton";
import { ProductBase, Product } from "@prisma/client";

export default function produkPage() {
    const [products, setProducts] = useState<ProductBase[]>([]);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [action, setAction] = useState<string>("");

    useEffect(() => {
        async function fetchProducts() {
            const res = await fetch('/api/admin/produk');
            const data = await res.json()
            setProducts(data);
        }
        fetchProducts();
    }, []);
    
    const toggleModal = ():void => {
        setIsOpen(!isOpen);
    }
    
    return (
        <>
            <div className="flex justify-between">
                <h1 className="font-bold text-2xl">Produk</h1>
                <AddButton 
                    objectName="Produk" 
                    action={()=>{
                        setAction("post");
                        toggleModal();
                    }}
                />
            </div>
            <table className="w-full">
                <thead>
                    <tr>
                        <th className="p-4 text-xs md:text-sm lg:text-base">ID</th>
                        <th className="p-4 text-xs md:text-sm lg:text-base">Produk</th>
                        <th className="p-4 text-xs md:text-sm lg:text-base">Harga</th>
                        <th className="p-4 text-xs md:text-sm lg:text-base">Action</th>
                    </tr>
                </thead>
                <tbody className="overflow-scroll">
                    {
                        products?.map((product) => (
                            <tr key={product.id}>
                                <td className="p-4 h-full text-xs md:text-sm lg:text-base">{product.id}</td>
                                <td className="flex items-center gap-4 p-4 h-full">
                                    <img src={product.image} alt={product.name} className="rounded-lg w-8 h-8 object-cover" />
                                    <span className="text-xs md:text-sm lg:text-base">{product.name}</span>
                                </td>
                                {/* <td className="p-4 h-full text-xs md:text-sm lg:text-base">Rp. {product.price.toLocaleString('id-ID')}</td> */}
                                <td className="flex justify-center gap-4 p-4 h-full">
                                    <button>
                                        <PencilLine className="" />
                                    </button>
                                    <button>
                                        <Trash2 className="" />
                                    </button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            {
                
                isOpen && (
                    <UpsertModal objectName={"Produk"} method={action} toggleModal={toggleModal}/>
                )
            }
        </>
    )
}