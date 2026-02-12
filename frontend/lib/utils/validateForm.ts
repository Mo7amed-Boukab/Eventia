import { ZodSchema } from 'zod';

/**
 * Valide des données avec un schéma Zod et retourne soit les données validées,
 * soit un objet d'erreurs formaté pour l'affichage dans les formulaires
 */
export function validateForm<T>(
    schema: ZodSchema<T>,
    data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
    const result = schema.safeParse(data);

    if (result.success) {
        return { success: true, data: result.data };
    }

    const errors: Record<string, string> = {};
    result.error.issues.forEach((err) => {
        const key = err.path.join('.');
        if (!errors[key]) {
            errors[key] = err.message;
        }
    });

    return { success: false, errors };
}
