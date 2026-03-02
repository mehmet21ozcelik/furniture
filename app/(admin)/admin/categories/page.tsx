export const dynamic = 'force-dynamic';

import { prisma } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CategoryDeleteButton } from "./CategoryDeleteButton";

export default async function AdminCategoriesPage() {
    const categories = await prisma.category.findMany({
        orderBy: { order: "asc" },
        include: {
            _count: {
                select: { products: true }
            }
        }
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-serif font-bold text-gray-900">Kategoriler</h1>
                <Link href="/admin/categories/new">
                    <Button>Yeni Kategori Ekle</Button>
                </Link>
            </div>

            <div className="bg-white shadow-sm rounded-lg border overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b">
                        <tr>
                            <th className="px-6 py-3">Sıra</th>
                            <th className="px-6 py-3">Kategori Adı</th>
                            <th className="px-6 py-3">Ürün Sayısı</th>
                            <th className="px-6 py-3">Oluşturma Tarihi</th>
                            <th className="px-6 py-3">İşlem</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {categories.map((category) => (
                            <tr key={category.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-gray-500">{category.order}</td>
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    {category.name}
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {category._count.products} Ürün
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {category.createdAt.toLocaleDateString('tr-TR')}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-3">
                                        <Link href={`/admin/categories/${category.id}/edit`}>
                                            <Button variant="outline" size="sm">Düzenle</Button>
                                        </Link>
                                        <CategoryDeleteButton id={category.id} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {categories.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                    Sistemde henüz kategori bulunmuyor.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
