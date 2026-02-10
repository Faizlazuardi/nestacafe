import { UserRole } from "@prisma/client"

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        name: string
        role: UserRole
    }
}