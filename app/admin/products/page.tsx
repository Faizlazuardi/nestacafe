"use server"

import { getAllProducts } from "@/lib/services/product";
import { getAllMaterials } from "@/lib/services/material";
import { Product } from "@/lib/types/product";
import { Material } from "@/lib/types/material";
import BaseList from "./components/baseList";

export default async function Page() {
    const products: Product[] = await getAllProducts();
    const materials: Material[] = await getAllMaterials()
    return (
        <BaseList products= {products} materials={materials}/>
    )
}