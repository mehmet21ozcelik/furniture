"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

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

export async function getSettingsAction(): Promise<SiteSettings> {
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
}

export async function updateSettingsAction(data: SiteSettings) {
    try {
        const promises = Object.entries(data).map(([key, value]) => {
            return prisma.setting.upsert({
                where: { key },
                update: { value },
                create: { key, value },
            });
        });

        await Promise.all(promises);

        revalidatePath("/", "layout");
        return { success: true };
    } catch (error) {
        console.error("Error updating settings:", error);
        return { success: false, error: "Ayarlar güncellenirken bir hata oluştu." };
    }
}
