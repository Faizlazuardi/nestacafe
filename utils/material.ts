import { MaterialType } from "@prisma/client";

export const unitMap: Record<MaterialType | string, string> = {
    [MaterialType.Solid]: "gram",
    [MaterialType.Liquid]: "ml",
};