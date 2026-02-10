import { CartItem } from "@/lib/types/cart";
import { VariantForSale } from "@/app/kasir/types";

export const getTotalMaterialUsage = (
    materialId: string,
    cartItems: CartItem[],
    variantMap: Map<string, VariantForSale>
): number => {
    return cartItems.reduce((total, item) => {
        const variant = variantMap.get(item.id);
        if (!variant) return total;

        const material = variant.materials.find(m => m.id === materialId);
        if (!material) return total;

        return total + material.quantityUsed * item.quantity;
    }, 0);
};
