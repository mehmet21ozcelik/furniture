import { z } from 'zod';

export const categorySchema = z.object({
    name: z.string().min(2, 'Kategori adı en az 2 karakter olmalıdır'),
    description: z.string().optional(),
    image: z.string().optional().or(z.literal('')),
    order: z.coerce.number().default(0),
});

export type CategoryInput = z.infer<typeof categorySchema>;
