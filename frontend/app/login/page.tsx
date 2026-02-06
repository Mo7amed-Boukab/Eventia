import React, { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Connexion | Eventia",
  description: "Accédez à votre espace privilège Eventia.",
};

const LoginPage = () => {
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
              <div className="w-12 h-px bg-[#C5A059]"></div>
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

      {/* Right Side - Form is a Client Component */}
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

          <Suspense fallback={
            <div className="flex flex-col items-center justify-center py-10">
              <Loader2 className="w-8 h-8 text-[#C5A059] animate-spin mb-4" />
              <p className="text-gray-400 text-sm italic">Chargement...</p>
            </div>
          }>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
