import { PaymentType } from "@prisma/client"
import { User } from "@/lib/types/user"

export interface Transaction {
    id: string,
    paymentType: PaymentType,
    total: number,
    createdAt: Date,
    cashier: Pick<User,'name'>
}