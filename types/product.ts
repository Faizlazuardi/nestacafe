import { VariantOption } from "@prisma/client"

export interface MaterialUsage {
    id: string;
    name: string;
    unit: string;
    stock: number;
    quantityUsed: number;
}

export interface ProductVariant {
    id: string;
    price: number;
    option: VariantOption;
    materials: MaterialUsage[];
}

export interface Product {
    id: string;
    name: string;
    image: string;
    variants: ProductVariant[];
}

export interface purchasedProduct {
    id: string
    name: string
    option: VariantOption
    quantity: number
    price: number
    subtotal: number
}