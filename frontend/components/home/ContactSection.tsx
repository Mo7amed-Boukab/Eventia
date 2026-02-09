import React from "react";
import { MapPinned, Phone, Mail, Clock } from "lucide-react";
import ContactForm from "./ContactForm";

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

          <ContactForm />
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

