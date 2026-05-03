import { ProductVariantForSale } from "../types/product";
import { totalMaterialUsage } from "./totalMaterialUsage";
import { MaterialStock, CartItem } from "@/app/kasir/types";

export const calculateAvailableStock = (
    materialId: string,
    materials: MaterialStock[],
    cartItems: CartItem[],
    variantList: Map<string, ProductVariantForSale>
): number => {
    return materials.find(m => m.id === materialId)?.stock ?? 0 - totalMaterialUsage(materialId, cartItems, variantList);
};
