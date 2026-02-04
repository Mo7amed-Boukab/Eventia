"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Accueil", path: "/" },
    { name: "À propos", path: "#about" },
    { name: "Nos événements", path: "#events" },
    { name: "Avis", path: "#testimonials" },
    { name: "Contact", path: "#contact" },
  ];

  const isHome = pathname === "/";
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (isAuthPage) return null;

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled || !isHome
          ? "bg-white/95 backdrop-blur-sm shadow-sm py-3"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <span
              className={`text-2xl font-bold ${isScrolled || !isHome ? "text-[#1A1A1A]" : "text-white"}`}
              style={{ fontFamily: "serif" }}
            >
              <span className="text-[#C5A059]">Ev</span>entia
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                className={`text-sm font-medium transition-colors ${
                  isScrolled || !isHome
                    ? "text-gray-600 hover:text-[#C5A059]"
                    : "text-white/90 hover:text-white"
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/login"
              className={`text-sm font-semibold transition-colors ${
                isScrolled || !isHome
                  ? "text-gray-600 hover:text-[#C5A059]"
                  : "text-white hover:text-[#C5A059]"
              }`}
            >
              se connecter
            </Link>
            <Link
              href="/register"
              className="bg-[#C5A059] text-white px-6 py-2 rounded-sm text-sm font-bold tracking-wider hover:bg-[#B08D45] transition-colors shadow-lg"
            >
              s'inscrire
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`${isScrolled || !isHome ? "text-gray-900" : "text-white"} p-2`}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl">
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-lg font-medium text-gray-900 hover:text-[#C5A059]"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 space-y-3 border-t border-gray-200">
              <Link
                href="/login"
                className="block text-center text-gray-900 hover:text-[#C5A059] font-semibold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                SE CONNECTER
              </Link>
              <Link
                href="/register"
                className="block text-center bg-[#C5A059] text-white px-6 py-2 rounded-sm font-bold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                S'INSCRIRE
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
