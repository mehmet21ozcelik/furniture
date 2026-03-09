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
            const settings = await prisma.siteSettings.findUnique({
                where: { id: "settings" }
            });

            if (!settings) {
                return DEFAULT_SETTINGS;
            }

            return {
                companyName: settings.companyName,
                phone: settings.phone,
                email: settings.email,
                address: settings.address,
                whatsapp: settings.whatsapp,
                heroTitle: settings.heroTitle,
                heroSubtitle: settings.heroSubtitle,
                heroImage: settings.heroImage,
                metaTitle: settings.metaTitle,
                metaDescription: settings.metaDescription,
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
        const updateData = Object.fromEntries(
            Object.entries(data).filter(([_, value]) => value !== undefined && value !== null)
        );

        await prisma.siteSettings.upsert({
            where: { id: "settings" },
            update: updateData,
            create: {
                id: "settings",
                ...DEFAULT_SETTINGS,
                ...updateData,
            },
        });

        revalidatePath("/", "layout");
        revalidateTag(CACHE_TAGS.settings);
        return { success: true };
    } catch (error) {
        console.error("Error updating settings:", error);
        throw new Error("Ayarlar kaydedilirken sunucu hatası oluştu.");
    }
}
