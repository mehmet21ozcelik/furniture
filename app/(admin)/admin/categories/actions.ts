import { actionClient } from "@/lib/safe-action";
import { categorySchema } from "@/lib/validations/category";
import { generateUniqueSlug } from "@/lib/services/slug.service";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const createCategoryAction = actionClient
    .schema(categorySchema)
    .action(async ({ parsedInput }) => {
        const { name, description, order, image } = parsedInput;

        const slug = await generateUniqueSlug(name, 'category');

        try {
            await prisma.category.create({
                data: {
                    name,
                    slug,
                    description: description || null,
                    image: image || null,
                    order,
                },
            });

            revalidatePath("/admin/categories");
            revalidatePath("/");
            return { success: true };
        } catch (error: any) {
            if (error.code === 'P2002') {
                return { success: false, error: "Bu isimde bir kategori zaten mevcut." };
            }
            return { success: false, error: "Kategori oluşturulurken bir hata oluştu." };
        }
    });

const updateCategorySchema = categorySchema.extend({
    id: z.string().cuid(),
});

export const updateCategoryAction = actionClient
    .schema(updateCategorySchema)
    .action(async ({ parsedInput }) => {
        const { id, name, description, order, image } = parsedInput;

        const slug = await generateUniqueSlug(name, 'category', id);

        try {
            await prisma.category.update({
                where: { id },
                data: {
                    name,
                    slug,
                    description: description || null,
                    image: image || null,
                    order,
                },
            });

            revalidatePath("/admin/categories");
            revalidatePath("/");
            return { success: true };
        } catch (error: any) {
            return { success: false, error: "Kategori güncellenirken bir hata oluştu." };
        }
    });

const deleteCategorySchema = z.object({
    id: z.string().cuid(),
});

export const deleteCategoryAction = actionClient
    .schema(deleteCategorySchema)
    .action(async ({ parsedInput }) => {
        try {
            const productCount = await prisma.product.count({
                where: { categoryId: parsedInput.id }
            });

            if (productCount > 0) {
                return { success: false, error: "Bu kategoriye ait ürünler olduğu için silemezsiniz." };
            }

            await prisma.category.delete({
                where: { id: parsedInput.id },
            });

            revalidatePath("/admin/categories");
            return { success: true };
        } catch (error) {
            return { success: false, error: "Kategori silinirken bir hata oluştu." };
        }
    });
