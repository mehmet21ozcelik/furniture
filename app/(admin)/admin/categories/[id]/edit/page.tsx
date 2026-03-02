import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
    const category = await prisma.category.findUnique({
        where: { id: params.id }
    });

    if (!category) {
        notFound();
    }

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-serif font-bold text-gray-900">Kategoriyi Düzenle</h1>
                <Link href="/admin/categories">
                    <Button variant="outline">Geri Dön</Button>
                </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <CategoryForm initialData={category} />
            </div>
        </div>
    );
}
