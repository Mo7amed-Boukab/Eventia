import { z } from 'zod';

export const contactSchema = z.object({
    name: z.string().min(1, 'Le nom est obligatoire').max(100, 'Max 100 caractères'),
    email: z.string().min(1, "L'email est obligatoire").email('Email invalide'),
    phone: z.string().optional(),
    subject: z.string().min(1, 'Le sujet est obligatoire').max(200, 'Max 200 caractères'),
    message: z.string().min(10, 'Le message doit contenir au moins 10 caractères').max(2000, 'Max 2000 caractères'),
});

export type ContactFormData = z.infer<typeof contactSchema>;
