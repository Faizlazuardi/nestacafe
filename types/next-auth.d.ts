import { UserRole } from "@prisma/client"
import { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            name: string
            role: UserRole
        }
    }

    interface User {
        id: string
        name: string
        role: UserRole
    }
}
