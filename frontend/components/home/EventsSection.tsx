'use client';

import React from 'react';
import { Calendar, MapPin, ChevronRight } from 'lucide-react';
import { MOCK_EVENTS } from '@/lib/constants';

const EventsSection: React.FC = () => {
  return (
    <section id="events" className="py-24 bg-[#F8F8F8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[#C5A059] text-xs font-bold tracking-[0.4em] uppercase block mb-3">Agenda Premium</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'serif' }}>
            Nos <span className="text-[#C5A059] italic">Sessions</span> À Venir
          </h2>
          <div className="w-20 h-1 bg-[#C5A059] mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {MOCK_EVENTS.map((event) => (
            <div key={event.id} className="group bg-white rounded-md border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-sm text-[10px] font-bold text-[#1A1A1A] uppercase tracking-[0.2em] shadow-lg">
                  {event.category}
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-2 text-xs text-[#C5A059] font-bold mb-4 uppercase tracking-wider">
                  <Calendar size={14} /> {event.date}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#C5A059] transition-colors leading-tight min-h-[3rem]" style={{ fontFamily: 'serif' }}>{event.title}</h3>
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
                  <span className="text-xs text-gray-400 font-medium flex items-center gap-1 uppercase tracking-tighter">
                    <MapPin size={14} className="text-[#C5A059]" /> {event.location}
                  </span>
                  <button className="text-[#1A1A1A] font-bold text-xs hover:text-[#C5A059] transition-colors flex items-center gap-1 uppercase tracking-widest">
                    Réserver <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <button className="bg-[#C5A059] text-white px-12 py-4 rounded-sm font-bold tracking-[0.2em] hover:bg-[#b89658] transition-all shadow-xl uppercase text-xs">
            Consulter l'agenda complet
          </button>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
