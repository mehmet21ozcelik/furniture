import { prisma } from '../db';
import { unstable_cache } from 'next/cache';
import { CACHE_TAGS } from '../cache/tags';
import { revalidatePath, revalidateTag } from 'next/cache';

export type SiteSettings = {
    companyName: string;
    phone: string;
    email: string;
    address: string;
    whatsapp: string;
    heroTitle: string;
    heroSubtitle: string;
    heroImage: string;
    metaTitle: string;
    metaDescription: string;
};

const DEFAULT_SETTINGS: SiteSettings = {
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

export const getSiteSettings = unstable_cache(
    async (): Promise<SiteSettings> => {
        try {
            const settings = await prisma.setting.findMany();
            const settingsMap = settings.reduce((acc, curr) => {
                acc[curr.key] = curr.value;
                return acc;
            }, {} as Record<string, string>);

            return {
                companyName: settingsMap.companyName || DEFAULT_SETTINGS.companyName,
                phone: settingsMap.phone || DEFAULT_SETTINGS.phone,
                email: settingsMap.email || DEFAULT_SETTINGS.email,
                address: settingsMap.address || DEFAULT_SETTINGS.address,
                whatsapp: settingsMap.whatsapp || DEFAULT_SETTINGS.whatsapp,
                heroTitle: settingsMap.heroTitle || DEFAULT_SETTINGS.heroTitle,
                heroSubtitle: settingsMap.heroSubtitle || DEFAULT_SETTINGS.heroSubtitle,
                heroImage: settingsMap.heroImage || DEFAULT_SETTINGS.heroImage,
                metaTitle: settingsMap.metaTitle || DEFAULT_SETTINGS.metaTitle,
                metaDescription: settingsMap.metaDescription || DEFAULT_SETTINGS.metaDescription,
            };
        } catch (error) {
            console.error("Error fetching settings:", error);
            return DEFAULT_SETTINGS;
        }
    },
    ['site-settings'],
    { tags: ['settings'] }
);

export async function updateSettings(data: Partial<SiteSettings>) {
    try {
        // Obje içinde null veya undefined olmayan geçerli değerleri al
        const settingsToUpdate = Object.entries(data).filter(([_, value]) => value !== undefined && value !== null);

        // Tüm güncellemeleri tek bir veritabanı işlemi (transaction) içinde sırayla yap
        await prisma.$transaction(
            settingsToUpdate.map(([key, value]) => {
                return prisma.setting.upsert({
                    where: { key },
                    update: { value: String(value) },
                    create: { key, value: String(value) },
                });
            })
        );

        revalidatePath("/", "layout");
        revalidateTag(CACHE_TAGS.settings);
        return { success: true };
    } catch (error) {
        console.error("Error updating settings:", error);
        throw new Error("Ayarlar kaydedilirken sunucu hatası oluştu.");
    }
}
