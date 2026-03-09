const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const DEFAULT_SETTINGS = {
            companyName: "Mobilya Vitrin",
            phone: "",
            email: "",
            address: "",
            whatsapp: "",
            heroTitle: "Evinize Değer Katan Tasarımlar",
            heroSubtitle: "Modern, şık ve konforlu mobilyalar ile yaşam alanlarınızı yeniden keşfedin.",
            heroImage: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1920",
            metaTitle: "Mobilya Vitrin | Modern Mobilya Tasarımları",
            metaDescription: "En şık ve modern mobilya koleksiyonları.",
        };

        const data = { companyName: "Test Company" };
        const updateData = Object.fromEntries(
            Object.entries(data).filter(([_, value]) => value !== undefined && value !== null)
        );

        console.log("Attempting upsert...");
        const result = await prisma.siteSettings.upsert({
            where: { id: "settings" },
            update: updateData,
            create: {
                id: "settings",
                ...DEFAULT_SETTINGS,
                ...updateData,
            },
        });
        console.log("Success:", result);
    } catch (error) {
        console.error("UPSERT ERROR:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
