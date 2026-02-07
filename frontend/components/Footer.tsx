"use client";

import React from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  Phone,
  Mail,
  MapPin,
  SendHorizonal,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Footer: React.FC = () => {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isAdminPage = pathname?.startsWith("/admin");

  if (isAuthPage || isAdminPage) return null;

  return (
    <footer className="bg-[#1A1A1A] text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="space-y-6">
            <Link
              href="/"
              className="text-3xl font-bold block"
              style={{ fontFamily: "serif" }}
            >
              <span className="text-[#C5A059]">Ev</span>entia
            </Link>
            <p className="text-gray-400 leading-relaxed font-light">
              Votre partenaire événementiel pour des moments inoubliables. Nous
              créons des expériences d'exception à travers tout le Maroc.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#C5A059] transition-colors"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#C5A059] transition-colors"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#C5A059] transition-colors"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-8 uppercase tracking-widest border-l-2 border-[#C5A059] pl-4">
              Liens rapides
            </h4>
            <ul className="space-y-4 text-gray-400">
              <li>
                <a href="/" className="hover:text-white transition-colors">
                  Accueil
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  À propos
                </a>
              </li>
              <li>
                <a
                  href="#events"
                  className="hover:text-white transition-colors"
                >
                  Nos événements
                </a>
              </li>
              <li>
                <a
                  href="#testimonials"
                  className="hover:text-white transition-colors"
                >
                  Avis
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-8 uppercase tracking-widest border-l-2 border-[#C5A059] pl-4">
              Contact
            </h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-[#C5A059]" />
                <span>+212 6 11 95 58 23</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-[#C5A059]" />
                <span>contact@eventia.com</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={16} className="text-[#C5A059]" />
                <span>Tanger, Maroc</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-8 uppercase tracking-widest border-l-2 border-[#C5A059] pl-4">
              Newsletter
            </h4>
            <p className="text-gray-400 mb-6 font-light">
              Inscrivez-vous pour recevoir les dernières nouvelles et offres
              exclusives.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Votre email"
                className="bg-white/5 border border-white/10 px-4 py-2 rounded-sm focus:outline-none focus:border-[#C5A059] flex-grow text-sm"
              />
              <button className="bg-[#C5A059] px-4 py-2 rounded-sm hover:bg-[#B08D45] transition-colors">
                <SendHorizonal size={"20px"} />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-white/10 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Eventia. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
