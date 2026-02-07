"use client";

import React, { useEffect } from "react";
import { X, AlertTriangle, ShieldCheck, HelpCircle, CheckCircle2 } from "lucide-react";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning" | "success" | "primary" | "premium";
    isLoading?: boolean;
    icon?: React.ReactNode;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirmer",
    cancelText = "Annuler",
    variant = "danger",
    isLoading = false,
    icon: customIcon,
}) => {
    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const getVariantStyles = () => {
        // Base premium style for all variants as requested
        const premiumStyle = {
            iconBg: "bg-[#FDFBF7] text-[#C5A059] border border-[#C5A059]/10",
            button: "bg-[#1A1A1A] hover:bg-[#C5A059] shadow-gray-200",
            line: "bg-[#C5A059]",
        };

        switch (variant) {
            case "danger":
                return {
                    ...premiumStyle,
                    icon: customIcon || <AlertTriangle size={24} />,
                };
            case "success":
                return {
                    ...premiumStyle,
                    icon: customIcon || <CheckCircle2 size={24} />,
                };
            case "warning":
                return {
                    ...premiumStyle,
                    icon: customIcon || <HelpCircle size={24} />,
                };
            case "primary":
            case "premium":
            default:
                return {
                    ...premiumStyle,
                    icon: customIcon || <ShieldCheck size={24} />,
                };
        }
    };

    const styles = getVariantStyles();

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop with subtle overlay */}
            <div
                className="absolute inset-0 bg-[#1A1A1A]/10 animate-in fade-in duration-300"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-md rounded-sm shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out">
                {/* Decorative top line */}
                <div className={`h-1 w-full ${styles.line}`} />

                <div className="p-8">
                    <div className="flex flex-col items-center text-center">
                        <div
                            className={`p-4 rounded-full mb-6 ${styles.iconBg} shadow flex items-center justify-center`}
                        >
                            {styles.icon}
                        </div>

                        <h3
                            className="text-2xl font-bold text-[#1A1A1A] mb-3 tracking-tight"
                            style={{ fontFamily: "serif" }}
                        >
                            {title}
                        </h3>

                        <p className="text-gray-500 leading-relaxed font-light text-sm max-w-[280px]">
                            {message}
                        </p>
                    </div>
                </div>

                <div className="px-8 pb-8 flex flex-col sm:flex-row-reverse items-center gap-3">
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`w-full sm:flex-1 py-4 rounded-sm text-white text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 disabled:opacity-50 ${styles.button}`}
                    >
                        {isLoading ? (
                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            confirmText
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="w-full sm:flex-1 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] hover:text-[#1A1A1A] hover:bg-gray-50 transition-all rounded-sm disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                </div>

                {/* Minimal close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-300 hover:text-gray-600 transition-colors"
                >
                    <X size={18} />
                </button>
            </div>
        </div>
    );
};

export default ConfirmModal;
