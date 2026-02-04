"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const LoginPage: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic validation
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
      router.push("/");
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
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Image & Content */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2069&auto=format&fit=crop"
          alt="Premium Event Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 w-full flex flex-col justify-between p-16 text-white">
          <Link href="/" className="flex items-center gap-2 group w-fit">
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="text-sm font-bold tracking-widest uppercase">
              Retour à l&apos;accueil
            </span>
          </Link>

          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-[1px] bg-[#C5A059]"></div>
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-[#C5A059]">
                Service Immédiat
              </span>
            </div>
            <h1
              className="text-5xl font-bold mb-6 leading-tight"
              style={{ fontFamily: "serif" }}
            >
              Accédez à votre <br /> espace privilège
            </h1>
            <p className="text-xl font-light text-gray-300 max-w-md italic">
              Gérez vos réservations, consultez votre agenda personnalisé et
              téléchargez vos supports de formation en un clic.
            </p>
          </div>

          <div className="text-sm text-gray-400 font-light">
            © {new Date().getFullYear()} Eventia. Tous droits réservés.
          </div>
        </div>
      </div>

      {/* Right Side - Professional Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16 bg-[#F8F8F8] lg:bg-white">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-12">
            <Link
              href="/"
              className="text-2xl font-bold"
              style={{ fontFamily: "serif" }}
            >
              <span className="text-[#C5A059]">Ev</span>entia
            </Link>
          </div>

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
      </div>
    </div>
  );
};

export default LoginPage;
