import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const categorySchema = z.object({
    name: z.string().min(1, "Kategori adı gerekli"),
    description: z.string().optional(),
    slug: z.string().optional(),
    order: z.string().transform((val) => parseInt(val, 10)).default("0"),
    image: z.string().optional(),
});

function slugify(text: string) {
    return text
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');
}

export async function createCategoryAction(formData: FormData) {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const orderStr = formData.get('order') as string;
    const image = formData.get('image') as string;

    if (!name) {
        return { success: false, error: "Kategori adı gerekli" };
    }

    const slug = slugify(name);
    const order = parseInt(orderStr, 10) || 0;

    try {
        await prisma.category.create({
            data: {
                name,
                slug,
                description,
                image: image || null,
                order,
            },
        });
    } catch (error: any) {
        if (error.code === 'P2002') {
            return { success: false, error: "Bu isimde bir kategori zaten mevcut." };
        }
        return { success: false, error: "Kategori oluşturulurken bir hata oluştu." };
    }

    revalidatePath("/admin/categories");
    revalidatePath("/");
    return { success: true };
}

export async function updateCategoryAction(id: string, formData: FormData) {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const orderStr = formData.get('order') as string;
    const image = formData.get('image') as string;

    if (!name) {
        return { success: false, error: "Kategori adı gerekli" };
    }

    const slug = slugify(name);
    const order = parseInt(orderStr, 10) || 0;

    try {
        await prisma.category.update({
            where: { id },
            data: {
                name,
                slug,
                description,
                image: image || null,
                order,
            },
        });
    } catch (error: any) {
        return { success: false, error: "Kategori güncellenirken bir hata oluştu." };
    }

    revalidatePath("/admin/categories");
    revalidatePath("/");
    return { success: true };
}

export async function deleteCategoryAction(id: string) {
    try {
        // Check if there are products in this category
        const productCount = await prisma.product.count({
            where: { categoryId: id }
        });

        if (productCount > 0) {
            return { success: false, error: "Bu kategoriye ait ürünler olduğu için silemezsiniz." };
        }

        await prisma.category.delete({
            where: { id },
        });

        revalidatePath("/admin/categories");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Kategori silinirken bir hata oluştu." };
    }
}
