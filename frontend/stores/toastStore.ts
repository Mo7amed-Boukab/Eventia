import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'info';

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
    title?: string;
}

interface ToastState {
    toasts: Toast[];
    success: (message: string, title?: string) => void;
    error: (message: string, title?: string) => void;
    info: (message: string, title?: string) => void;
    removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>()((set) => {
    const addToast = (type: ToastType, message: string, title?: string) => {
        const id = Math.random().toString(36).substring(2, 9);
        const defaultTitles = { success: 'Succès', error: 'Erreur', info: 'Information' };

        set((state) => ({
            toasts: [...state.toasts, { id, type, message, title: title || defaultTitles[type] }],
        }));

        // Auto remove after 5 seconds
        setTimeout(() => {
            set((state) => ({
                toasts: state.toasts.filter((t) => t.id !== id),
            }));
        }, 5000);
    };

    return {
        toasts: [],
        success: (message: string, title?: string) => addToast('success', message, title),
        error: (message: string, title?: string) => addToast('error', message, title),
        info: (message: string, title?: string) => addToast('info', message, title),
        removeToast: (id: string) =>
            set((state) => ({
                toasts: state.toasts.filter((t) => t.id !== id),
            })),
    };
});
