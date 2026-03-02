export const dynamic = 'force-dynamic';

import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ProductForm } from "@/components/admin/ProductForm";

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
                <ProductForm categories={categories} />
            </div>
        </div>
    );
}
