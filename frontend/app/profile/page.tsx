import React from "react";
import ProfileForm from "@/components/ProfileForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
    title: "Profil | Eventia",
    description: "Gérez vos informations personnelles et votre compte.",
};

export default function ProfilePage() {
    return (
        <main className="min-h-screen bg-white">
            <section className="bg-white border-b border-gray-100 pt-32 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-6">
                        {/* Back Link */}
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-[#C5A059] transition-colors w-fit group"
                        >
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                            Retour au site
                        </Link>

                       <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="bg-[#C5A059] w-8 h-[1px]"></span>
                                <span className="text-[#C5A059] text-[10px] font-bold uppercase tracking-[0.4em]">Espace Membre</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900" style={{ fontFamily: 'serif' }}>
                                Mon <span className="text-[#C5A059] italic">Profil</span>
                            </h1>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <div className="bg-gray-50/30 pt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ProfileForm />
                </div>
            </div>
        </main>
    );
}
