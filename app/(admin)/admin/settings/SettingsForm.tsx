"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { updateSettingsAction } from "./actions";
import { SiteSettingsInput } from "@/lib/validations/settings";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { useRouter } from "next/navigation";

interface SettingsFormProps {
    initialSettings: SiteSettingsInput;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [heroImage, setHeroImage] = useState(initialSettings.heroImage);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        const formData = new FormData(e.currentTarget);
        const data: SiteSettingsInput = {
            companyName: formData.get('companyName') as string,
            phone: formData.get('phone') as string,
            email: formData.get('email') as string,
            address: formData.get('address') as string,
            whatsapp: formData.get('whatsapp') as string,
            heroTitle: formData.get('heroTitle') as string,
            heroSubtitle: formData.get('heroSubtitle') as string,
            heroImage: heroImage,
            metaTitle: formData.get('metaTitle') as string,
            metaDescription: formData.get('metaDescription') as string,
        };

        const result = await updateSettingsAction(data);
        setIsLoading(false);

        if (result?.data?.success) {
            setMessage({ type: 'success', text: 'Ayarlar başarıyla kaydedildi.' });
            router.refresh();
        } else if (result?.validationErrors) {
            // Handle Zod validation errors
            const errors = result.validationErrors as any;
            const firstErrorKey = Object.keys(errors)[0];
            const firstErrorMatch = errors[firstErrorKey];

            let errorMessage = "Doğrulama hatası.";

            if (firstErrorMatch?._errors?.length > 0) {
                errorMessage = firstErrorMatch._errors[0];
            } else if (typeof firstErrorMatch === 'string') {
                errorMessage = firstErrorMatch;
            }

            setMessage({ type: 'error', text: errorMessage });
        } else {
            setMessage({ type: 'error', text: result?.data?.error || result?.serverError || 'Bir hata oluştu.' });
        }
    };

    return (
        <form key={JSON.stringify(initialSettings)} onSubmit={handleSubmit} className="space-y-8">
            {message && (
                <div className={`p-4 rounded-md border text-sm ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
                    }`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Genel Bilgiler */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium border-b pb-2">Genel & İletişim Bilgileri</h3>
                    <div>
                        <label className="text-sm font-medium">Firma Adı *</label>
                        <Input name="companyName" required defaultValue={initialSettings.companyName} className="mt-1" />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Telefon</label>
                        <Input name="phone" defaultValue={initialSettings.phone} className="mt-1" />
                    </div>
                    <div>
                        <label className="text-sm font-medium">E-posta</label>
                        <Input name="email" type="email" defaultValue={initialSettings.email} className="mt-1" />
                    </div>
                    <div>
                        <label className="text-sm font-medium">WhatsApp (Örn: 905XXXXXXXXX)</label>
                        <Input name="whatsapp" defaultValue={initialSettings.whatsapp} className="mt-1" />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Adres</label>
                        <textarea
                            name="address"
                            defaultValue={initialSettings.address}
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                        />
                    </div>
                </div>

                {/* Hero Bölümü */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium border-b pb-2">Ana Sayfa (Hero) Ayarları</h3>
                    <div>
                        <label className="text-sm font-medium">Hero Başlığı *</label>
                        <Input name="heroTitle" required defaultValue={initialSettings.heroTitle} className="mt-1" />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Hero Alt Başlığı</label>
                        <textarea
                            name="heroSubtitle"
                            defaultValue={initialSettings.heroSubtitle}
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium block mb-2">Giriş Resmi</label>
                        <ImageUploadField
                            value={heroImage ? [heroImage] : []}
                            onUploadComplete={(url) => setHeroImage(url)}
                            onRemove={() => setHeroImage("")}
                            maxFiles={1}
                        />
                    </div>
                </div>

                {/* SEO Ayarları */}
                <div className="space-y-4 md:col-span-2">
                    <h3 className="text-lg font-medium border-b pb-2">SEO Ayarları</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium">Meta Başlık (Tab Title)</label>
                            <Input name="metaTitle" defaultValue={initialSettings.metaTitle} className="mt-1" />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Meta Açıklama</label>
                            <Input name="metaDescription" defaultValue={initialSettings.metaDescription} className="mt-1" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-4">
                <Button type="submit" className="w-full md:w-auto px-12" disabled={isLoading}>
                    {isLoading ? "Kaydediliyor..." : "Ayarları Kaydet"}
                </Button>
            </div>
        </form>
    );
}
