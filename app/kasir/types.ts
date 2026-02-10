import { VariantOption } from "@prisma/client";

export type CheckoutInput = {
    cashierId: string;
    paymentType: string;
    total: number;
    products: {
        id: string;
        name: string;
        quantity: number;
        subtotal: number;
    }[];
};

export type VariantMaterialUsage = {
    id: string
    quantityUsed: number
}

export type VariantForSale = {
    id: string
    option: VariantOption
    price: number
    materials: VariantMaterialUsage[]
}

export type ProductForSale = {
    id: string
    name: string
    image: string
    variants: VariantForSale[]
}

export type MaterialStock = {
    id: string
    stock: number
}