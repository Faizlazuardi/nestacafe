import { MaterialType } from "@prisma/client"

export interface Material{
    id: string,
    name: string,
    type: MaterialType,
    quantity: number
}