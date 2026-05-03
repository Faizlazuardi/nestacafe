import { VariantOption } from "@prisma/client"

export type MaterialUsage = {
    id: string;
    quantityUsed: number;
};

export interface MaterialUsageDetail extends MaterialUsage {
    name: string;
    unit: string;
}

export interface ProductVariant {
    id: string;
    price: number;
    option: VariantOption;
    materials: MaterialUsageDetail[];
}

export interface Product {
    id: string;
    name: string;
    image: string;
    variants: ProductVariant[];
}
export interface ProductVariantForSale extends Omit<ProductVariant, "materials"> {
    materials: MaterialUsage[];
}

export interface ProductForSale extends Omit<Product, "variants"> {
    variants: ProductVariantForSale[];
}

export type purchasedProduct = {
    id: string
    name: string
    option: VariantOption
    quantity: number
    price: number
    subtotal: number
}
