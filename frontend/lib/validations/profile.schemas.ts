import { z } from 'zod';

export const updateProfileSchema = z.object({
    first_name: z.string().min(1, 'Le prénom est obligatoire').max(50, 'Max 50 caractères'),
    last_name: z.string().min(1, 'Le nom est obligatoire').max(50, 'Max 50 caractères'),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
