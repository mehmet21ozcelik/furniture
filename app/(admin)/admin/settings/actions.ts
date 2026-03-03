"use server";

import { updateSettings, getSiteSettings } from "@/lib/services/settings.service";
import { actionClient } from "@/lib/safe-action";
import { siteSettingsSchema } from "@/lib/validations/settings";

export const updateSettingsAction = actionClient
    .schema(siteSettingsSchema)
    .action(async ({ parsedInput }) => {
        try {
            await updateSettings({
                ...parsedInput,
                email: parsedInput.email || "",
                heroImage: parsedInput.heroImage || ""
            });
            return { success: true };
        } catch (error: any) {
            console.error("Error updating settings:", error);
            return { success: false, error: "Ayarlar güncellenirken bir hata oluştu." };
        }
    });

export async function getSettingsAction() {
    return await getSiteSettings();
}
