import { z } from 'zod';

export const eventSchema = z.object({
    title: z.string().min(1, 'Le titre est obligatoire').max(200, 'Max 200 caractères'),
    description: z.string().min(1, 'La description est obligatoire').max(5000, 'Max 5000 caractères'),
    category: z.enum(['Formation', 'Workshop', 'Conférence', 'Networking'], {
        message: 'Veuillez choisir une catégorie'
    }),
    date: z.string().min(1, 'La date est obligatoire'),
    time: z.string().min(1, "L'heure est obligatoire"),
    location: z.string().min(1, 'Le lieu est obligatoire').max(200, 'Max 200 caractères'),
    price: z.coerce.number().min(0, 'Le prix doit être positif ou nul'),
    maxParticipants: z.coerce.number().int().min(1, 'Minimum 1 participant'),
});

export type EventFormData = z.infer<typeof eventSchema>;
