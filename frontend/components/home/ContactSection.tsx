"use client";

import React from "react";
import { MapPinned, Phone, Mail, Clock } from "lucide-react";

const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-24 bg-[#F8F8F8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <span className="text-[#C5A059] font-bold text-xs uppercase tracking-[0.4em] block mb-4">
              Support Expert
            </span>
            <h2
              className="text-4xl font-bold text-gray-900 mb-6 leading-tight"
              style={{ fontFamily: "serif" }}
            >
              Parlons de votre prochain projet
            </h2>
            <p className="text-gray-500 mb-12 text-lg font-light leading-relaxed">
              Que vous soyez une entreprise cherchant à former ses cadres ou un
              expert souhaitant intervenir, nous sommes là pour vous
              accompagner.
            </p>

            <div className="space-y-10">
              <div className="flex items-start gap-5">
                <div className="bg-white p-4 rounded-md hover:shadow-xl transition-all">
                  <MapPinned className="text-[#C5A059]" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm uppercase tracking-widest mb-1">
                    Siège Corporatif
                  </h4>
                  <p className="text-gray-500 font-light">
                    Boulevard d'Anfa, Casablanca
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="bg-white p-4 rounded-md hover:shadow-xl transition-all">
                  <Phone className="text-[#C5A059]" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm uppercase tracking-widest mb-1">
                    Ligne Privilégiée
                  </h4>
                  <p className="text-gray-500 font-light">+212 5 22 00 00 00</p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="bg-white p-4 rounded-md hover:shadow-xl transition-all">
                  <Mail className="text-[#C5A059]" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm uppercase tracking-widest mb-1">
                    Email professionnel
                  </h4>
                  <p className="text-gray-500 font-light">contact@eventia.ma</p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="bg-white p-4 rounded-md hover:shadow-xl transition-all">
                  <Clock className="text-[#C5A059]" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm uppercase tracking-widest mb-1">
                    Horaires
                  </h4>
                  <p className="text-gray-500 font-light">
                    Lun - Ven : 9h00 - 18h00
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded transition-all">
            <h3
              className="text-xl font-bold text-gray-900 mb-6"
              style={{ fontFamily: "serif" }}
            >
              Envoyez-nous un message
            </h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 text-sm placeholder:text-gray-300 border border-gray-200 rounded-sm focus:outline-none focus:border-[#C5A059] transition-colors"
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2.5 text-sm placeholder:text-gray-300 border border-gray-200 rounded-sm focus:outline-none focus:border-[#C5A059] transition-colors"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                  Téléphone
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-2.5 text-sm placeholder:text-gray-300 border border-gray-200 rounded-sm focus:outline-none focus:border-[#C5A059] transition-colors"
                  placeholder="+212 6 XX XX XX XX"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                  Sujet
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 text-sm placeholder:text-gray-300 border border-gray-200 rounded-sm focus:outline-none focus:border-[#C5A059] transition-colors"
                  placeholder="Sujet de votre message"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2.5 text-sm placeholder:text-gray-300 border border-gray-200 rounded-sm focus:outline-none focus:border-[#C5A059] transition-colors resize-none"
                  placeholder="Votre message..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-[#C5A059] text-white px-8 py-3.5 rounded-sm font-bold tracking-[0.2em] hover:bg-[#B08D45] transition-all hover:shadow-xl uppercase text-xs"
              >
                Envoyer le message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
