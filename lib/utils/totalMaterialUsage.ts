import { CartItem } from "@/app/kasir/types";
import { ProductVariantForSale } from "../types/product";

export const totalMaterialUsage = (
    materialId: string,
    cartItems: CartItem[],
    variantList: Map<string, ProductVariantForSale>
): number => {
    return cartItems.reduce((total, item) => {
        const variant = variantList.get(item.id);
        if (!variant) return total;

        const material = variant.materials.find(m => m.id === materialId);
        if (!material) return total;

        return total + material.quantityUsed * item.quantity;
    }, 0);
};
