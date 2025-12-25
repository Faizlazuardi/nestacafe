import { VariantOption } from "@prisma/client";

export interface CartItem {
    id: string;
    name: string;
    image: string;
    price: number;
    variant: VariantOption;
    quantity: number;
}