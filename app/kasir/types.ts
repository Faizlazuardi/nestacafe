import { PaymentType, VariantOption } from "@prisma/client";

export type CheckoutInput = {
    cashierId: string;
    paymentType: PaymentType;
    total: number;
    products: {
        id: string;
        name: string;
        quantity: number;
        subtotal: number;
    }[];
};

export type MaterialStock = {
    id: string
    stock: number
}
export interface CartItem {
    id: string;
    name: string;
    image: string;
    price: number;
    variant: VariantOption;
    quantity: number;
}