const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const tables = await prisma.$queryRaw`SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'`;
        console.log("Tables:", tables);

        const siteSettings = await prisma.siteSettings.findMany();
        console.log("SiteSettings content:", siteSettings);
    } catch (error) {
        console.error("DB CHECK ERROR:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
