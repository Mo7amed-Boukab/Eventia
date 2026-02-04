"use client";

import React from "react";
import Image from "next/image";

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#C5A059]/10 rounded-full blur-3xl"></div>
            <span className="text-[#C5A059] font-bold text-xs uppercase tracking-[0.4em] block mb-4">
              Notre Vision
            </span>
            <h2
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight"
              style={{ fontFamily: "serif" }}
            >
              Votre partenaire pour le développement professionnel
            </h2>
            <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
              <p>
                Eventia redéfinit l'accès aux connaissances et au networking
                professionnel au Maroc. Nous sélectionnons rigoureusement les
                événements les plus pertinents pour votre carrière et votre
                entreprise.
              </p>
              <p>
                De la formation technique pointue aux grands sommets
                internationaux, notre plateforme offre une expérience de
                réservation fluide, sécurisée et digne des standards les plus
                élevés.
              </p>
            </div>
            <div className="mt-10 flex items-center gap-8">
              <button className="text-[#C5A059] font-bold border-b-2 border-[#C5A059] pb-1 hover:text-[#B08D45] hover:border-[#B08D45] transition-all uppercase text-sm tracking-widest">
                Découvrir nos services
              </button>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-[#C5A059] rotate-3 rounded-md opacity-10 group-hover:rotate-6 transition-transform"></div>
            <img
              src="https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2069&auto=format&fit=crop"
              alt="Elite Training Environment"
              className="relative rounded-md shadow-2xl w-full h-[550px] object-cover"
            />
            <div className="absolute -bottom-6 -right-6 bg-[#1A1A1A] text-white p-8 shadow-2xl rounded-xl hidden md:block border border-white/10">
              <div
                className="text-[#C5A059] font-bold text-4xl mb-1"
                style={{ fontFamily: "serif" }}
              >
                100%
              </div>
              <div className="text-white/60 text-xs uppercase tracking-widest font-semibold">
                Satisfaction Client
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
