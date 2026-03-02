'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/Button";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { createProductAction, updateProductAction } from "@/app/(admin)/admin/products/actions";

interface Category {
    id: string;
    name: string;
}

interface ProductFormProps {
    categories: Category[];
    initialData?: {
        id: string;
        name: string;
        shortDescription: string | null;
        description: string;
        categoryId: string;
        price: any;
        images: string[];
        isActive: boolean;
        isFeatured: boolean;
    };
}

export function ProductForm({ categories, initialData }: ProductFormProps) {
    const [images, setImages] = useState<string[]>(initialData?.images || []);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleUploadComplete = (url: string) => {
        setImages((prev) => [...prev, url]);
    };

    const handleRemove = (url: string) => {
        setImages((prev) => prev.filter((u) => u !== url));
    };

    const action = initialData ? updateProductAction.bind(null, initialData.id) : createProductAction;

    return (
        <form
            action={async (formData) => {
                setIsSubmitting(true);
                setError(null);
                try {
                    await action(formData);
                } catch (err: any) {
                    setError(err.message || "Bir hata oluştu.");
                } finally {
                    setIsSubmitting(false);
                }
            }}
            className="space-y-4"
        >
            {error && (
                <div className="p-4 rounded-md bg-red-50 border border-red-200 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* Hidden input to pass image URLs as a comma-separated string */}
            <input type="hidden" name="images" value={images.join(',')} />

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Adı *</label>
                <input
                    name="name"
                    type="text"
                    required
                    defaultValue={initialData?.name}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-furniture-bronze focus:ring-furniture-bronze sm:text-sm p-2 border"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kısa Açıklama</label>
                <input
                    name="shortDescription"
                    type="text"
                    defaultValue={initialData?.shortDescription || ''}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-furniture-bronze focus:ring-furniture-bronze sm:text-sm p-2 border"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama *</label>
                <textarea
                    name="description"
                    required
                    rows={4}
                    defaultValue={initialData?.description}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-furniture-bronze focus:ring-furniture-bronze sm:text-sm p-2 border"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
                    <select
                        name="categoryId"
                        required
                        defaultValue={initialData?.categoryId}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-furniture-bronze focus:ring-furniture-bronze sm:text-sm p-2 border"
                    >
                        <option value="">Kategori Seçin</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fiyat (₺)</label>
                    <input
                        name="price"
                        type="number"
                        step="0.01"
                        defaultValue={initialData?.price ? Number(initialData.price) : ''}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-furniture-bronze focus:ring-furniture-bronze sm:text-sm p-2 border"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ürün Resimleri</label>
                <ImageUploadField
                    value={images}
                    onUploadComplete={handleUploadComplete}
                    onRemove={handleRemove}
                />
            </div>

            <div className="flex flex-col sm:flex-row sm:space-x-6 gap-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                        name="isActive"
                        type="checkbox"
                        defaultChecked={initialData ? initialData.isActive : true}
                        className="h-4 w-4 rounded border-gray-300 text-furniture-bronze focus:ring-furniture-bronze"
                    />
                    <span className="text-sm font-medium text-gray-700">Aktif Mi?</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                        name="isFeatured"
                        type="checkbox"
                        defaultChecked={initialData?.isFeatured}
                        className="h-4 w-4 rounded border-gray-300 text-furniture-bronze focus:ring-furniture-bronze"
                    />
                    <span className="text-sm font-medium text-gray-700">Öne Çıkan Ürün</span>
                </label>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                <Button type="submit" className="w-full sm:flex-1" disabled={isSubmitting}>
                    {isSubmitting ? 'Kaydediliyor...' : (initialData ? 'Ürünü Güncelle' : 'Ürünü Kaydet')}
                </Button>
                {initialData && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => window.history.back()}
                        disabled={isSubmitting}
                        className="w-full sm:w-auto"
                    >
                        Vazgeç
                    </Button>
                )}
            </div>
        </form>
    );
}
