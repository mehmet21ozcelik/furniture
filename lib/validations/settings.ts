import { z } from "zod";

export const siteSettingsSchema = z.object({
    companyName: z.string().min(1, "Firma adı gerekli"),
    phone: z.string().optional().default(""),
    email: z.string().email("Geçerli bir e-posta giriniz").optional().or(z.literal("")).transform(v => v || ""),
    address: z.string().optional().default(""),
    whatsapp: z.string().optional().default(""),
    heroTitle: z.string().min(1, "Hero başlığı gerekli"),
    heroSubtitle: z.string().optional().default(""),
    heroImage: z.string().url("Geçerli bir görsel URL'si girin").optional().or(z.literal("")).transform(v => v || ""),
    metaTitle: z.string().optional().default(""),
    metaDescription: z.string().optional().default(""),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
