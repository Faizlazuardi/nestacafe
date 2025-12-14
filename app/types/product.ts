import { VariantOption } from "@prisma/client"

export interface ProductVariant {
    id: string;
    price: number;
    variant: VariantOption;
}

export interface Product {
    id: string;
    name: string;
    image: string;
    products: ProductVariant[];
}
