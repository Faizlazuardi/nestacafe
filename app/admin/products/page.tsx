"use server"

import { getAllProducts } from "@/services/product.service";
import BaseList from "./components/baseList";
import { Product } from "@/types/product";

export default async function ProdukPage() {
    const products: Product[] = await getAllProducts(true);
    return (
        <BaseList products= {products}/>
    )
}