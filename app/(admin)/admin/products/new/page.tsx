export const dynamic = 'force-dynamic';

import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/Button";
import { createProductAction } from "../actions";
import Link from "next/link";

export default async function NewProductPage() {
    const categories = await prisma.category.findMany({
        orderBy: { name: "asc" }
    });

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-serif font-bold text-gray-900">Yeni Ürün Ekle</h1>
                <Link href="/admin/products">
                    <Button variant="outline">Geri Dön</Button>
                </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <form action={createProductAction} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Adı *</label>
                        <input name="name" type="text" required className="w-full rounded-md border-gray-300 shadow-sm focus:border-furniture-bronze focus:ring-furniture-bronze sm:text-sm p-2 border" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kısa Açıklama</label>
                        <input name="shortDescription" type="text" className="w-full rounded-md border-gray-300 shadow-sm focus:border-furniture-bronze focus:ring-furniture-bronze sm:text-sm p-2 border" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama *</label>
                        <textarea name="description" required rows={4} className="w-full rounded-md border-gray-300 shadow-sm focus:border-furniture-bronze focus:ring-furniture-bronze sm:text-sm p-2 border" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
                            <select name="categoryId" required className="w-full rounded-md border-gray-300 shadow-sm focus:border-furniture-bronze focus:ring-furniture-bronze sm:text-sm p-2 border">
                                <option value="">Kategori Seçin</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fiyat (₺)</label>
                            <input name="price" type="number" step="0.01" className="w-full rounded-md border-gray-300 shadow-sm focus:border-furniture-bronze focus:ring-furniture-bronze sm:text-sm p-2 border" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Resim URL'leri (Virgülle ayırın)</label>
                        <input name="images" type="text" placeholder="https://..., https://..." className="w-full rounded-md border-gray-300 shadow-sm focus:border-furniture-bronze focus:ring-furniture-bronze sm:text-sm p-2 border" />
                    </div>

                    <div className="flex space-x-6">
                        <label className="flex items-center space-x-2">
                            <input name="isActive" type="checkbox" defaultChecked className="rounded border-gray-300 text-furniture-bronze focus:ring-furniture-bronze" />
                            <span className="text-sm font-medium text-gray-700">Aktif Mi?</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input name="isFeatured" type="checkbox" className="rounded border-gray-300 text-furniture-bronze focus:ring-furniture-bronze" />
                            <span className="text-sm font-medium text-gray-700">Öne Çıkan Ürün</span>
                        </label>
                    </div>

                    <div className="pt-4">
                        <Button type="submit" className="w-full">Ürünü Kaydet</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
