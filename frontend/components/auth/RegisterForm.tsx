"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useToastStore } from "@/stores/toastStore";

const RegisterForm: React.FC = () => {
    const router = useRouter();
    const { register, user, isAuthenticated, isLoading: authLoading } = useAuthStore();
    const toast = useToastStore();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [generalError, setGeneralError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [hasShownToast, setHasShownToast] = useState(false);

    // Rediriger si déjà connecté
    useEffect(() => {
        if (!authLoading && isAuthenticated && user) {
            if (!hasShownToast) {
                toast.success(`Bienvenue parmi nous, ${user.first_name} !`, "Compte créé");
                setHasShownToast(true);
            }

            if (user.role === 'ADMIN') {
                router.push("/admin/dashboard");
            } else {
                router.push("/");
            }
        }
    }, [authLoading, isAuthenticated, user, router, toast, hasShownToast]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "firstName") setFirstName(value);
        if (name === "lastName") setLastName(value);
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

        const newErrors: Record<string, string> = {};
        if (!firstName) newErrors.firstName = "Le prénom est obligatoire";
        if (!lastName) newErrors.lastName = "Le nom est obligatoire";
        if (!email) newErrors.email = "L'email est obligatoire";
        if (!password) newErrors.password = "Le mot de passe est obligatoire";

        if (Object.keys(newErrors).length > 0) {
            setFieldErrors(newErrors);
            return;
        }

        if (password.length < 6) {
            setFieldErrors({ password: "Le mot de passe doit contenir au moins 6 caractères" });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setFieldErrors({ email: "Veuillez entrer une adresse email valide" });
            return;
        }

        if (!acceptedTerms) {
            setGeneralError("Vous devez accepter les conditions générales");
            return;
        }

        setIsLoading(true);

        try {
            await register(firstName, lastName, email, password);
            router.push("/");
        } catch (err: any) {
            console.error("Registration error:", err);

            if (err.response?.status === 409) {
                setFieldErrors({ email: "Cet email est déjà utilisé" });
            } else if (err.response?.data?.message) {
                if (Array.isArray(err.response.data.message)) {
                    setGeneralError(err.response.data.message.join(", "));
                } else {
                    setGeneralError(err.response.data.message);
                }
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
                    Création de Compte
                </h2>
                <p className="text-gray-500 text-sm font-light">
                    Commencez votre expérience premium dès aujourd&apos;hui.
                </p>
            </div>

            {generalError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded animate-in fade-in slide-in-from-top-2">
                    <p className="text-red-600 text-sm font-medium">{generalError}</p>
                </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
                            Prénom
                        </label>
                        <input
                            type="text"
                            name="firstName"
                            value={firstName}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-300 border ${fieldErrors.firstName ? 'border-red-500 bg-red-50/10' : 'border-gray-200'} rounded-sm focus:outline-none focus:border-[#C5A059] transition-all`}
                            placeholder="Entrez votre prénom"
                            disabled={isLoading}
                        />
                        {fieldErrors.firstName && (
                            <p className="text-[10px] text-red-500 mt-1 font-medium">{fieldErrors.firstName}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                            Nom
                        </label>
                        <input
                            type="text"
                            name="lastName"
                            value={lastName}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-300 border ${fieldErrors.lastName ? 'border-red-500 bg-red-50/10' : 'border-gray-200'} rounded-sm focus:outline-none focus:border-[#C5A059] transition-all`}
                            placeholder="Entrez votre nom"
                            disabled={isLoading}
                        />
                        {fieldErrors.lastName && (
                            <p className="text-[10px] text-red-500 mt-1 font-medium">{fieldErrors.lastName}</p>
                        )}
                    </div>
                </div>

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
                        <p className="text-[10px] text-red-500 mt-1 font-medium">{fieldErrors.email}</p>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                        Mot de passe
                    </label>
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
                        <p className="text-[10px] text-red-500 mt-1 font-medium">{fieldErrors.password}</p>
                    )}
                </div>

                <div className="flex items-start gap-3 text-[11px] text-gray-500 pt-2">
                    <input
                        type="checkbox"
                        checked={acceptedTerms}
                        onChange={(e) => {
                            setAcceptedTerms(e.target.checked);
                            if (e.target.checked) setGeneralError("");
                        }}
                        className="mt-0.5 w-4 h-4 rounded border-gray-200 text-[#C5A059] focus:ring-[#C5A059] accent-[#C5A059]"
                        disabled={isLoading}
                    />
                    <span className="leading-tight font-serif">
                        J&apos;accepte les{" "}
                        <a href="#" className="text-[#C5A059] font-bold">
                            Conditions Générales
                        </a>{" "}
                        et j&apos;ai lu la politique de confidentialité.
                    </span>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#C5A059] text-white py-3 rounded-sm font-bold tracking-[0.2em] hover:bg-[#b99656] transition-all flex items-center justify-center gap-2 uppercase text-xs shadow-xl mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? "Inscription en cours..." : "s'inscrire"}
                    {!isLoading && <ChevronRight size={16} />}
                </button>
            </form>

            <div className="mt-4 text-center">
                <p className="text-gray-500 text-sm font-light">
                    Déjà membre ?{" "}
                    <Link
                        href="/login"
                        className="text-[#C5A059] font-bold hover:text-[#1A1A1A] transition-colors uppercase tracking-widest text-[11px] ml-1"
                    >
                        Se connecter
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterForm;
