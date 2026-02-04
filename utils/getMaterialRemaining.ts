import { CartItem } from "@/types/cart";
import { Material } from "@/types/material";
import { ProductVariant } from "@/types/product";
import { getMaterialStock } from "./getMaterialStock";
import { getTotalMaterialUsage } from "./getTotalMaterialUsage";

export const getMaterialRemaining = (
    materialId: string,
    materials: Pick<Material, "id" | "stock">[],
    cartItems: CartItem[],
    variantMap: Map<string, ProductVariant>
): number => {
    const stock = getMaterialStock(materials, materialId);
    const used = getTotalMaterialUsage(materialId, cartItems, variantMap);
    return stock - used;
};
