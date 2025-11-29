import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()
async function main() {
    const hashPassword = await bcrypt.hash('Admin99',10)
    const admin1 = await prisma.user.upsert({
            where: { name: 'Admin99' },
            update: {},
            create: {
            name: 'Admin99',
            password: hashPassword,
            role: UserRole.admin
        },
    })
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })