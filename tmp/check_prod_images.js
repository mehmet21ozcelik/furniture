
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const products = await prisma.product.findMany({
        select: { name: true, images: true },
        where: {
            OR: [
                { name: { contains: 'test' } },
                { name: { contains: 'Final' } }
            ]
        }
    });
    console.log(JSON.stringify(products, null, 2));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
