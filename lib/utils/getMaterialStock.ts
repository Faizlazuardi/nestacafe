import { MaterialStock } from "@/app/kasir/types";

export const getMaterialStock = (materials: MaterialStock[], materialId: string): number => {
    return materials.find(m => m.id === materialId)?.stock ?? 0;
};
