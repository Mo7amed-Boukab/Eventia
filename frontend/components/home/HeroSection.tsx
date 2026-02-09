import React from "react";
import { ChevronRight } from "lucide-react";

const HeroSection: React.FC = () => {
  return (
    <section className="relative h-screen flex items-center">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2069&auto=format&fit=crop"
          alt="Premium Professional Event Venue"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-[#1A1A1A]/90 via-[#1A1A1A]/40 to-transparent" />
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white pt-20">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-px bg-[#C5A059]"></div>
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-[#C5A059]">
              Excellence Corporative
            </span>
          </div>
          <h1
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            style={{ fontFamily: "serif" }}
          >
            L'Art de l'Événementiel <br />{" "}
            <span className="text-[#C5A059] italic">Professionnel</span>
          </h1>
          <p className="text-lg md:text-xl font-light text-gray-300 mb-10 max-w-2xl leading-relaxed border-l-2 border-[#C5A059] pl-6">
            Découvrez une plateforme exclusive dédiée aux conférences,
            séminaires et formations de haut niveau. Connectez-vous à
            l'excellence et transformez chaque rencontre en opportunité
            stratégique pour votre entreprise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-[#C5A059] text-white px-10 py-4 rounded-sm font-bold tracking-wider hover:bg-[#B08D45] transition-all transform hover:scale-105 shadow-2xl flex items-center justify-center gap-2 uppercase text-xs">
              PARCOURIR LES ÉVÉNEMENTS <ChevronRight size={18} />
            </button>
            <button className="bg-transparent border border-white/40 backdrop-blur-md text-white px-10 py-4 rounded-sm font-bold tracking-wider hover:bg-white/10 transition-all text-xs uppercase">
              SOLUTIONS SUR MESURE
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
