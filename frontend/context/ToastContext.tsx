"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
    title?: string;
}

interface ToastContextType {
    toast: {
        success: (message: string, title?: string) => void;
        error: (message: string, title?: string) => void;
        info: (message: string, title?: string) => void;
    };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const addToast = useCallback((type: ToastType, message: string, title?: string) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, type, message, title }]);

        // Auto remove after 5 seconds
        setTimeout(() => removeToast(id), 5000);
    }, [removeToast]);

    const toastMethods = {
        success: (message: string, title?: string) => addToast('success', message, title || 'Succès'),
        error: (message: string, title?: string) => addToast('error', message, title || 'Erreur'),
        info: (message: string, title?: string) => addToast('info', message, title || 'Information'),
    };

    return (
        <ToastContext.Provider value={{ toast: toastMethods }}>
            {children}
            {/* Toast Container */}
            <div className="fixed top-6 right-6 z-[1000] flex flex-col gap-4 w-full max-w-sm pointer-events-none">
                {toasts.map((t) => (
                    <ToastItem key={t.id} toast={t} onRemove={() => removeToast(t.id)} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

const ToastItem: React.FC<{ toast: Toast; onRemove: () => void }> = ({ toast, onRemove }) => {
    const getIcon = () => {
        switch (toast.type) {
            case 'success': return <CheckCircle2 className="text-[#C5A059]" size={20} />;
            case 'error': return <AlertCircle className="text-red-500" size={20} />;
            case 'info': return <Info className="text-gray-900" size={20} />;
        }
    };

    const getColorClass = () => {
        switch (toast.type) {
            case 'success': return 'border-l-[#C5A059]';
            case 'error': return 'border-l-red-500';
            case 'info': return 'border-l-gray-900';
        }
    };

    return (
        <div
            className={`pointer-events-auto bg-white border-l-4 ${getColorClass()} shadow-[0_10px_30px_-5px_rgba(0,0,0,0.1)] rounded-sm p-5 flex items-start gap-4 animate-in slide-in-from-right-10 duration-500 ease-out border border-gray-50`}
        >
            <div className="shrink-0 mt-0.5">
                {getIcon()}
            </div>
            <div className="flex-1 space-y-1">
                {toast.title && (
                    <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-900" style={{ fontFamily: 'serif' }}>
                        {toast.title}
                    </h4>
                )}
                <p className="text-sm text-gray-500 font-light leading-snug">
                    {toast.message}
                </p>
            </div>
            <button
                onClick={onRemove}
                className="shrink-0 p-1 text-gray-300 hover:text-gray-900 transition-colors"
            >
                <X size={14} />
            </button>
        </div>
    );
};
