"use server"

import { getAllProducts } from "@/lib/services/product.service";
import BaseList from "./components/baseList";
import { Product } from "@/lib/types/product";

export default async function Page() {
    const products: Product[] = await getAllProducts();
    return (
        <BaseList products= {products}/>
    )
}