import { CartItem } from "@/lib/types/cart";
import { getMaterialStock } from "./getMaterialStock";
import { getTotalMaterialUsage } from "./getTotalMaterialUsage";
import { MaterialStock, VariantForSale } from "@/app/kasir/types";

export const getMaterialRemaining = (
    materialId: string,
    materials: MaterialStock[],
    cartItems: CartItem[],
    variantMap: Map<string, VariantForSale>
): number => {
    const stock = getMaterialStock(materials, materialId);
    const used = getTotalMaterialUsage(materialId, cartItems, variantMap);
    return stock - used;
};
