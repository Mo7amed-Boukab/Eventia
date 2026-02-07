"use client";

import Link from "next/link";
import { ArrowLeft, Home, Search, Map as MapIcon } from "lucide-react";

export default function NotFound() {
    return (
        <main className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center pt-10 pb-10 px-6 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-[#F5F2EB]/50 -z-10 translate-x-1/4 skew-x-12"></div>
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[#C5A059]/5 rounded-full -z-10 blur-3xl"></div>

            <div className="max-w-2xl w-full text-center relative z-10">
                {/* Large 404 with Serif Font */}
                <div className="relative inline-block mb-12">
                    <h1
                        className="text-[12rem] md:text-[15rem] font-black text-[#1A1A1A] leading-none opacity-5 select-none"
                        style={{ fontFamily: 'serif' }}
                    >
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 bg-white rounded-full shadow-2xl flex items-center justify-center border border-[#C5A059]/10">
                            <Search size={32} className="text-[#C5A059] opacity-20" />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-6">
                    <div className="flex items-center justify-center gap-3">
                        <span className="bg-[#C5A059] w-8 h-[1px]"></span>
                        <span className="text-[#C5A059] text-[10px] font-bold uppercase tracking-[0.4em]">Égaré dans l'excellence</span>
                        <span className="bg-[#C5A059] w-8 h-[1px]"></span>
                    </div>

                    <h2
                        className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight"
                        style={{ fontFamily: 'serif' }}
                    >
                        Page <span className="text-[#C5A059] italic">Introuvable</span>
                    </h2>

                    <p className="text-gray-500 font-light leading-loose max-w-md mx-auto">
                        L'expérience que vous recherchez semble s'être volatilisée. Il se peut que le lien soit expiré ou que l'événement ait été déplacé vers une nouvelle dimension.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
                        <Link
                            href="/"
                            className="group flex items-center gap-3 px-10 py-4 bg-[#1A1A1A] text-white rounded-sm text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#C5A059] transition-all shadow-xl active:scale-95"
                        >
                            <Home size={14} className="group-hover:scale-110 transition-transform" />
                            Retour à l'accueil
                        </Link>

                        <button
                            onClick={() => window.history.back()}
                            className="group flex items-center gap-3 px-10 py-4 bg-white text-[#1A1A1A] border border-gray-100 rounded-sm text-[10px] font-bold uppercase tracking-[0.2em] hover:border-[#C5A059]/30 transition-all active:scale-95"
                        >
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform text-[#C5A059]" />
                            Page précédente
                        </button>
                    </div>
                </div>

                {/* Footer Brand */}
                <div className="mt-20 pt-10 border-t border-gray-100/50 flex flex-col items-center opacity-30">
                    <div className="flex items-center gap-1.5 grayscale shrink-0 mb-3">
                        <span className="text-xl font-black text-gray-900 tracking-tighter">EVENTIA</span>
                        <div className="w-1.5 h-1.5 bg-gray-900 rounded-full mt-1.5"></div>
                    </div>
                    <p className="text-[8px] text-gray-400 font-medium uppercase tracking-[0.4em]">Excellence • Passion • Partage</p>
                </div>
            </div>
        </main>
    );
}
