import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ProductDeleteButton } from "./ProductDeleteButton";

export default async function AdminProductsPage() {
    const products = await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            category: {
                select: { name: true }
            }
        }
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-serif font-bold text-gray-900">Ürünler</h1>
                <Link href="/admin/products/new">
                    <Button>Yeni Ürün Ekle</Button>
                </Link>
            </div>

            <div className="bg-white shadow-sm rounded-lg border overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b">
                        <tr>
                            <th className="px-6 py-3">Ürün Adı</th>
                            <th className="px-6 py-3">Kategori</th>
                            <th className="px-6 py-3">Fiyat</th>
                            <th className="px-6 py-3">Durum</th>
                            <th className="px-6 py-3">Tarih</th>
                            <th className="px-6 py-3">İşlem</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    {product.name}
                                    {product.isFeatured && (
                                        <span className="ml-2 inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                                            Öne Çıkan
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-gray-500">{product.category.name}</td>
                                <td className="px-6 py-4 text-gray-500">
                                    {product.price ? formatPrice(Number(product.price)) : '-'}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {product.isActive ? 'Aktif' : 'Pasif'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {product.createdAt.toLocaleDateString('tr-TR')}
                                </td>
                                <td className="px-6 py-4">
                                    <ProductDeleteButton id={product.id} />
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                    Sistemde henüz ürün bulunmuyor.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
