"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const { register } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!firstName || !lastName || !email || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Veuillez entrer une adresse email valide");
      return;
    }

    if (!acceptedTerms) {
      setError("Vous devez accepter les conditions générales");
      return;
    }

    setIsLoading(true);

    try {
      await register(firstName, lastName, email, password);
      router.push("/");
    } catch (err: any) {
      console.error("Registration error:", err);

      if (err.response?.status === 409) {
        setError("Cet email est déjà utilisé");
      } else if (err.response?.data?.message) {
        if (Array.isArray(err.response.data.message)) {
          setError(err.response.data.message.join(", "));
        } else {
          setError(err.response.data.message);
        }
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
                Excellence Corporative
              </span>
            </div>
            <h1
              className="text-5xl font-bold mb-6 leading-tight"
              style={{ fontFamily: "serif" }}
            >
              Rejoignez l&apos;élite des <br /> événements professionnels
            </h1>
            <p className="text-xl font-light text-gray-300 max-w-md italic">
              Accédez à des formations exclusives, des workshops de haut niveau
              et un réseau d&apos;experts inégalé au Maroc.
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
              Créer un compte
            </h2>
            <p className="text-gray-500 text-sm font-light">
              Commencez votre expérience premium dès aujourd&apos;hui.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
                  Prénom
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-300 border border-gray-200 rounded-sm focus:outline-none focus:border-[#C5A059] transition-colors"
                  placeholder="Entrer votre prenom"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                  Nom
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-300 border border-gray-200 rounded-sm focus:outline-none focus:border-[#C5A059] transition-colors"
                  placeholder="Entrer votre nom"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-300 border border-gray-200 rounded-sm focus:outline-none focus:border-[#C5A059] transition-colors"
                placeholder="nom@gmail.com"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-300 border border-gray-200 rounded-sm focus:outline-none focus:border-[#C5A059] transition-colors"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            <div className="flex items-start gap-3 text-[11px] text-gray-500 pt-2">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-gray-200 text-[#C5A059] focus:ring-[#C5A059] accent-[#C5A059]"
                disabled={isLoading}
              />
              <span className="leading-tight">
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
              {isLoading ? "Inscription en cours..." : "s'inscrire"}{" "}
              {!isLoading && <ChevronRight size={16} />}
            </button>
          </form>

          <div className="mt-4 text-center lg:text-center">
            <p className="text-gray-500 text-sm font-light">
              Déjà membre ?{" "}
              <Link
                href="/login"
                className="text-[#C5A059] font-bold tracking-[0.2em] hover:text-[#1A1A1A] transition-colors uppercase tracking-widest text-[11px] ml-1"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
