import { MaterialUnit } from "@prisma/client"

export interface Material{
    id: string,
    name: string,
    unit: MaterialUnit,
    stock: number
}