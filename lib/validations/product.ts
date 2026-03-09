import { z } from 'zod';

export const productSchema = z.object({
    name: z.string().min(2, 'Ürün adı en az 2 karakter olmalıdır'),
    shortDescription: z.string().optional(),
    description: z.string().min(10, 'Açıklama çok kısa'),
    price: z.coerce.number().positive().max(99999999.99, 'Fiyat çok yüksek').optional().or(z.literal('')),
    images: z.array(z.string()).min(1, 'En az bir görsel eklemelisiniz'),
    categoryId: z.string().uuid().or(z.string().cuid()),
    isFeatured: z.boolean().default(false),
    isActive: z.boolean().default(true),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
});

export type ProductInput = z.infer<typeof productSchema>;
