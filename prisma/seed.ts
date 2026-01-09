import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()
async function main() {
    const admin = await prisma.user.upsert({
            where: { name: 'Admin99' },
            update: {},
            create: {
            name: 'Admin99',
            password: await bcrypt.hash('Admin99',10),
            role: UserRole.Admin
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