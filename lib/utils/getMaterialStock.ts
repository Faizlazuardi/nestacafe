import { Material } from "@/types/material";

export const getMaterialStock = (materials: Pick<Material, "id" | "stock">[], materialId: string): number => {
    return materials.find(m => m.id === materialId)?.stock ?? 0;
};
