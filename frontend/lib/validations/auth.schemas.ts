import { z } from 'zod';

// Password partagé entre register et changePassword
const passwordSchema = z.string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
    .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
    .regex(/\d/, 'Le mot de passe doit contenir au moins un chiffre');

export const loginSchema = z.object({
    email: z.string().min(1, "L'email est obligatoire").email('Email invalide'),
    password: z.string().min(1, 'Le mot de passe est obligatoire'),
});

export const registerSchema = z.object({
    first_name: z.string().min(1, 'Le prénom est obligatoire').max(50, 'Max 50 caractères'),
    last_name: z.string().min(1, 'Le nom est obligatoire').max(50, 'Max 50 caractères'),
    email: z.string().min(1, "L'email est obligatoire").email('Email invalide'),
    password: passwordSchema,
});

export const changePasswordSchema = z.object({
    oldPassword: z.string().min(1, "L'ancien mot de passe est obligatoire"),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, 'Veuillez confirmer le mot de passe'),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
});

// Types inférés automatiquement
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
