"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createCategoryAction, updateCategoryAction } from "@/app/(admin)/admin/categories/actions";
import { ImageUploadField } from "./ImageUploadField";

interface CategoryFormProps {
    initialData?: {
        id: string;
        name: string;
        description: string | null;
        image: string | null;
        order: number;
    };
}

export function CategoryForm({ initialData }: CategoryFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [image, setImage] = useState<string | null>(initialData?.image || null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            order: Number(formData.get('order')) || 0,
            image: image || undefined,
        };

        let result;
        if (initialData) {
            result = await updateCategoryAction({ ...data, id: initialData.id });
        } else {
            result = await createCategoryAction(data);
        }

        setIsLoading(false);

        if (result?.data?.success) {
            router.push("/admin/categories");
            router.refresh();
        } else if (result?.data?.error) {
            setError(result.data.error);
        } else if (result?.serverError) {
            setError(result.serverError);
        } else {
            setError("Bir hata oluştu");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded border border-red-200 text-sm">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <label className="text-sm font-medium" htmlFor="name">Kategori Adı</label>
                    <Input
                        id="name"
                        name="name"
                        defaultValue={initialData?.name}
                        required
                        className="mt-1"
                        placeholder="Örn: Oturma Odası"
                    />
                </div>

                <div>
                    <label className="text-sm font-medium" htmlFor="description">Açıklama</label>
                    <textarea
                        id="description"
                        name="description"
                        defaultValue={initialData?.description || ""}
                        className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                        placeholder="Kategori hakkında kısa açıklama..."
                    />
                </div>

                <div>
                    <label className="text-sm font-medium" htmlFor="order">Sıralama</label>
                    <Input
                        id="order"
                        name="order"
                        type="number"
                        defaultValue={initialData?.order || 0}
                        className="mt-1"
                    />
                </div>

                <div>
                    <label className="text-sm font-medium block mb-2">Kategori Görseli</label>
                    <ImageUploadField
                        value={image ? [image] : []}
                        onUploadComplete={(url) => setImage(url)}
                        onRemove={() => setImage(null)}
                        maxFiles={1}
                    />
                    <input type="hidden" name="image" value={image || ""} />
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button type="submit" className="w-full sm:flex-1" disabled={isLoading}>
                    {isLoading ? "Kaydediliyor..." : initialData ? "Güncelle" : "Kategori Oluştur"}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={isLoading}
                    className="w-full sm:w-auto"
                >
                    İptal
                </Button>
            </div>
        </form>
    );
}
