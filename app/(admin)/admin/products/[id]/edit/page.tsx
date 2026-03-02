import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: { params: { id: string } }) {
    const product = await prisma.product.findUnique({
        where: { id: params.id }
    });

    if (!product) {
        notFound();
    }

    const categories = await prisma.category.findMany({
        orderBy: { name: "asc" }
    });

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-serif font-bold text-gray-900">Ürünü Düzenle</h1>
                <Link href="/admin/products">
                    <Button variant="outline">Geri Dön</Button>
                </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <ProductForm
                    categories={categories}
                    initialData={{
                        ...product,
                        price: product.price ? Number(product.price) : null
                    }}
                />
            </div>
        </div>
    );
}
