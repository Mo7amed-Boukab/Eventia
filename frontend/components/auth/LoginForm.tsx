"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const LoginForm: React.FC = () => {
    const router = useRouter();
    const { login, user, isAuthenticated, isLoading: authLoading } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Redirect if already logged in
    useEffect(() => {
        if (!authLoading && isAuthenticated && user) {
            if (user.role === 'ADMIN') {
                router.push("/admin/dashboard");
            } else {
                router.push("/");
            }
        }
    }, [authLoading, isAuthenticated, user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Veuillez remplir tous les champs");
            return;
        }

        if (password.length < 6) {
            setError("Le mot de passe doit contenir au moins 6 caractères");
            return;
        }

        setIsLoading(true);

        try {
            await login(email, password);
        } catch (err: any) {
            console.error("Login error:", err);

            if (err.response?.status === 401) {
                setError("Email ou mot de passe incorrect");
            } else if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError("Une erreur est survenue. Veuillez réessayer.");
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

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-sm">
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                        Email Professionnel
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-300 border border-gray-200 rounded-sm focus:outline-none focus:border-[#C5A059] transition-colors"
                        placeholder="nom@entreprise.com"
                        disabled={isLoading}
                    />
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-300 border border-gray-200 rounded-sm focus:outline-none focus:border-[#C5A059] transition-colors"
                        placeholder="••••••••"
                        disabled={isLoading}
                    />
                </div>

                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-200 text-[#C5A059] focus:ring-[#C5A059] accent-[#C5A059]"
                        disabled={isLoading}
                    />
                    <label className="text-[11px] text-gray-500 font-medium">
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

            <div className="mt-4 text-center lg:text-center">
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
