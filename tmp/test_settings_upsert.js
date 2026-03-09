
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const data = {
            companyName: "Mobilya Vitrin Test",
            phone: "05554443322",
            heroTitle: "Test Hero Title",
        };

        const promises = Object.entries(data).map(([key, value]) => {
            return prisma.setting.upsert({
                where: { key },
                update: { value },
                create: { key, value },
            });
        });

        const result = await Promise.all(promises);
        console.log("SUCCESS:", result);
    } catch (e) {
        console.error("ERROR:", e);
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
