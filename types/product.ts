import { VariantOption } from "@prisma/client"

export interface MaterialUsage {
    id: string;
    name: string;
    type: string;
    quantityUsed: number;
}

export interface ProductVariant {
    id: string;
    price: number;
    option: VariantOption;
    materials?: MaterialUsage[];
}

export interface Product {
    id: string;
    name: string;
    image: string;
    variants: ProductVariant[];
}
