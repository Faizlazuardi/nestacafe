import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()
async function main() {
    const materials = await prisma.material.createMany({
        data: [
            { name: "Tea", type: "Solid", quantity: 1000 },
            { name: "Lemon", type: "Solid", quantity: 1000 },
            { name: "Lychee", type: "Solid", quantity: 1000 },
            { name: "Orange", type: "Solid", quantity: 1000 },
            { name: "Blackcurrant", type: "Solid", quantity: 1000 },
            { name: "Milo Powder", type: "Solid", quantity: 1000 },
            { name: "Coffee", type: "Solid", quantity: 1000 },
            { name: "Milk", type: "Liquid", quantity: 1000 },
            { name: "Palm Sugar", type: "Solid", quantity: 1000 },
            { name: "Ice", type: "Liquid", quantity: 1000 },
        ],
    });

    const productBases = await prisma.productBase.createMany({
        data: [
            { name: "Lemon Tea", image: "https://eiyfpqwedihxllmaktyk.supabase.co/storage/v1/object/public/Product/Lemon%20Tea.png" },
            { name: "Lychee Tea", image: "https://eiyfpqwedihxllmaktyk.supabase.co/storage/v1/object/public/Product/Lychee%20Tea.png" },
            { name: "Lemonade", image: "https://eiyfpqwedihxllmaktyk.supabase.co/storage/v1/object/public/Product/Lemonade.png" },
            { name: "Orange", image: "https://eiyfpqwedihxllmaktyk.supabase.co/storage/v1/object/public/Product/Orange.png" },
            { name: "Blackcurrant", image: "https://eiyfpqwedihxllmaktyk.supabase.co/storage/v1/object/public/Product/Blackcurrant.png" },
            { name: "Milo Original", image: "https://eiyfpqwedihxllmaktyk.supabase.co/storage/v1/object/public/Product/Milo%20Original.png" },
            { name: "Milo Coffe", image: "https://eiyfpqwedihxllmaktyk.supabase.co/storage/v1/object/public/Product/Milo%20Coffe.png" },
            { name: "Caffe Late", image: "https://eiyfpqwedihxllmaktyk.supabase.co/storage/v1/object/public/Product/Caffe%20Late.png" },
            { name: "Coffe Gula Aren", image: "https://eiyfpqwedihxllmaktyk.supabase.co/storage/v1/object/public/Product/Coffe%20Gula%20Aren.png" },
            { name: "Nescafe Ice Roast", image: "https://eiyfpqwedihxllmaktyk.supabase.co/storage/v1/object/public/Product/Nescafe%20Ice%20Roast.png" },
        ],
    });

    const bases = await prisma.productBase.findMany();
    const getBaseId = (name: string) => bases.find((b) => b.name === name)!.id;

    const products = await prisma.product.createMany({
        data: [
            { baseId: getBaseId("Lemon Tea"), variant: "Normal", price: 5000 },
            { baseId: getBaseId("Lychee Tea"), variant: "Normal", price: 5000 },
            { baseId: getBaseId("Lemonade"), variant: "Normal", price: 5000 },
            { baseId: getBaseId("Orange"), variant: "Normal", price: 5000 },
            { baseId: getBaseId("Blackcurrant"), variant: "Normal", price: 5000 },

            { baseId: getBaseId("Milo Original"), variant: "Normal", price: 10000 },
            { baseId: getBaseId("Milo Coffe"), variant: "Normal", price: 12000 },

            { baseId: getBaseId("Caffe Late"), variant: "Normal", price: 9000 },
            { baseId: getBaseId("Caffe Late"), variant: "Strong", price: 11000 },

            { baseId: getBaseId("Coffe Gula Aren"), variant: "Normal", price: 10000 },
            { baseId: getBaseId("Coffe Gula Aren"), variant: "Strong", price: 12000 },

            { baseId: getBaseId("Nescafe Ice Roast"), variant: "Shoot_X1", price: 5000 },
            { baseId: getBaseId("Nescafe Ice Roast"), variant: "Shoot_X2", price: 7000 },
            { baseId: getBaseId("Nescafe Ice Roast"), variant: "Shoot_X3", price: 9000 },
        ],
    });

    const admin = await prisma.user.upsert({
            where: { name: 'Admin99' },
            update: {},
            create: {
            name: 'Admin99',
            password: await bcrypt.hash('Admin99',10),
            role: UserRole.admin
        },
    })
    const kasir = await prisma.user.upsert({
            where: { name: 'Kasir99' },
            update: {},
            create: {
            name: 'Kasir99',
            password: await bcrypt.hash('Kasir99',10),
            role: UserRole.cashier
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