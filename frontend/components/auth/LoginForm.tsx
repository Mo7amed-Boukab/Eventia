"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useToastStore } from "@/stores/toastStore";
import { loginSchema } from "@/lib/validations";
import { validateForm } from "@/lib/utils/validateForm";

const LoginForm: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login, user, isAuthenticated, isLoading: authLoading } = useAuthStore();
    const toast = useToastStore();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [generalError, setGeneralError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [hasShownToast, setHasShownToast] = useState(false);

    // Redirect if already logged in
    useEffect(() => {
        if (!authLoading && isAuthenticated && user) {
            if (!hasShownToast) {
                toast.success(`Heureux de vous revoir, ${user.first_name} !`, "Connexion réussie");
                setHasShownToast(true);
            }

            const redirectUrl = searchParams.get('redirect');
            if (redirectUrl) {
                router.push(redirectUrl);
            } else if (user.role === 'ADMIN') {
                router.push("/admin/dashboard");
            } else {
                router.push("/");
            }
        }
    }, [authLoading, isAuthenticated, user, router, searchParams, toast, hasShownToast]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "email") setEmail(value);
        if (name === "password") setPassword(value);

        // Clear specific error
        if (fieldErrors[name]) {
            setFieldErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
        setGeneralError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFieldErrors({});
        setGeneralError("");

        // Validation avec Zod
        const result = validateForm(loginSchema, { email, password });
        if (!result.success) {
            setFieldErrors(result.errors);
            return;
        }

        setIsLoading(true);

        try {
            await login(email, password);
        } catch (err: any) {
            console.error("Login error:", err);

            if (err.response?.status === 401) {
                setGeneralError("Email ou mot de passe incorrect");
            } else if (err.response?.data?.message) {
                setGeneralError(err.response.data.message);
            } else {
                setGeneralError("Une erreur est survenue. Veuillez réessayer.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md">
            <div className="mb-10 text-center lg:text-left">
                <h2
                    className="text-3xl font-bold text-gray-900 mb-2"
                    style={{ fontFamily: "serif" }}
                >
                    Connexion
                </h2>
                <p className="text-gray-500 text-sm font-light">
                    Bienvenue. Connectez-vous à votre compte professionnel.
                </p>
            </div>

            {generalError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-sm animate-in fade-in slide-in-from-top-2">
                    <p className="text-red-600 text-sm font-medium">{generalError}</p>
                </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                        Email Professionnel
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-300 border ${fieldErrors.email ? 'border-red-500 bg-red-50/10' : 'border-gray-200'} rounded-sm focus:outline-none focus:border-[#C5A059] transition-all`}
                        placeholder="nom@entreprise.com"
                        disabled={isLoading}
                    />
                    {fieldErrors.email && (
                        <p className="text-[10px] text-red-500 mt-1 font-medium italic">{fieldErrors.email}</p>
                    )}
                </div>

                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                            Mot de passe
                        </label>
                        <Link
                            href="#"
                            className="text-[#C5A059] text-[10px] font-bold uppercase tracking-widest hover:text-[#1A1A1A] transition-colors"
                        >
                            Mode de passe oublié ?
                        </Link>
                    </div>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-300 border ${fieldErrors.password ? 'border-red-500 bg-red-50/10' : 'border-gray-200'} rounded-sm focus:outline-none focus:border-[#C5A059] transition-all`}
                        placeholder="••••••••"
                        disabled={isLoading}
                    />
                    {fieldErrors.password && (
                        <p className="text-[10px] text-red-500 mt-1 font-medium italic">{fieldErrors.password}</p>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-200 text-[#C5A059] focus:ring-[#C5A059] accent-[#C5A059]"
                        disabled={isLoading}
                    />
                    <label className="text-[11px] text-gray-500 font-medium font-serif">
                        Rester connecté
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#C5A059] text-white py-3 rounded-sm font-bold tracking-[0.2em] hover:bg-[#b99656] transition-all flex items-center justify-center gap-2 uppercase text-xs shadow-xl mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? "Connexion en cours..." : "se connecter"}{" "}
                    {!isLoading && <ChevronRight size={16} />}
                </button>
            </form>

            <div className="mt-4 text-center">
                <p className="text-gray-500 text-sm font-light">
                    Nouveau sur Eventia ?{" "}
                    <Link
                        href="/register"
                        className="text-[#C5A059] font-bold hover:text-[#1A1A1A] transition-colors uppercase tracking-widest text-[11px] ml-1"
                    >
                        Créer un compte
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginForm;
