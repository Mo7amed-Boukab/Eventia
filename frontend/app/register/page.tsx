import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Inscription | Eventia",
  description: "Rejoignez l'élite des événements professionnels avec Eventia.",
};

const RegisterPage = () => {
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

          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
