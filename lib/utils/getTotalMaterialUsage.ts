import { CartItem } from "@/types/cart";
import { ProductVariant } from "@/types/product";

export const getTotalMaterialUsage = (
    materialId: string,
    cartItems: CartItem[],
    variantMap: Map<string, ProductVariant>
): number => {
    return cartItems.reduce((total, item) => {
        const variant = variantMap.get(item.id);
        if (!variant) return total;

        const material = variant.materials.find(m => m.id === materialId);
        if (!material) return total;

        return total + material.quantityUsed * item.quantity;
    }, 0);
};
