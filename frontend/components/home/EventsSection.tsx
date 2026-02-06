"use client";

import React, { useState, useEffect } from "react";
import { Calendar, MapPin, ChevronRight, Loader2 } from "lucide-react";
import { eventService } from "@/lib/services/eventService";
import { Event, EventStatus } from "@/lib/types";
import Link from "next/link";

const EventsSection: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const STATIC_IMAGE =
    "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2069&auto=format&fit=crop";

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      // Fetch only published events for the public site
      const allEvents = await eventService.getAll();
      const publishedEvents = allEvents.filter(
        (e: Event) => e.status === EventStatus.PUBLISHED,
      );

      // Sort by date (closest first)
      const sorted = publishedEvents.sort(
        (a: Event, b: Event) =>
          new Date(a.date).getTime() - new Date(b.date).getTime(),
      );

      setEvents(sorted.slice(0, 6)); // Show first 6 upcoming published events
    } catch (err) {
      console.error("Error fetching public events:", err);
      setError("Impossible de charger les événements.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
        .format(date)
        .toUpperCase();
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <section id="events" className="py-24 bg-[#F8F8F8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[#C5A059] text-xs font-bold tracking-[0.4em] uppercase block mb-3">
            Agenda Premium
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: "serif" }}
          >
            Nos <span className="text-[#C5A059] italic">Sessions</span> À Venir
          </h2>
          <div className="w-20 h-1 bg-[#C5A059] mx-auto mt-6"></div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-[#C5A059] animate-spin mb-4" />
            <p className="text-gray-500 italic">
              Recherche des meilleures opportunités...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-white rounded border border-gray-100">
            <p className="text-gray-400 italic">{error}</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 bg-white rounded border border-gray-100">
            <p className="text-gray-400 italic font-light tracking-wide">
              Plus d'événements prévus pour le moment. Revenez bientôt !
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {events.map((event) => (
              <div
                key={event._id}
                className="group bg-white rounded-md border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 flex flex-col h-full"
              >
                <div className="relative h-64 overflow-hidden shrink-0">
                  <Link href={`/events/${event._id}`}>
                    <img
                      src={event.image || STATIC_IMAGE}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] cursor-pointer"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </Link>
                  <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-sm text-[10px] font-bold text-[#1A1A1A] uppercase tracking-[0.2em] shadow-lg pointer-events-none">
                    {event.category}
                  </div>
                </div>
                <div className="p-8 flex flex-col grow">
                  <div className="flex items-center gap-2 text-xs text-[#C5A059] font-bold mb-4 uppercase tracking-wider">
                    <Calendar size={14} /> {formatDate(event.date)}
                  </div>
                  <Link href={`/events/${event._id}`} className="block mb-4">
                    <h3
                      className="text-xl font-bold text-gray-900 group-hover:text-[#C5A059] transition-colors leading-tight cursor-pointer"
                      style={{ fontFamily: "serif" }}
                    >
                      {event.title}
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100 min-h-16">
                    <span className="text-[10px] text-gray-400 font-bold flex items-start gap-1 uppercase tracking-wider max-w-[65%]">
                      <MapPin
                        size={14}
                        className="text-[#C5A059] shrink-0 mt-px"
                      />
                      <span className="line-clamp-2 leading-tight">
                        {event.location}
                      </span>
                    </span>
                    <Link
                      href={`/events/${event._id}`}
                      className="text-[#1A1A1A] font-bold text-[10px] hover:text-[#C5A059] transition-colors flex items-center gap-1 uppercase tracking-[0.2em] group/btn shrink-0"
                    >
                      Réserver{" "}
                      <ChevronRight
                        size={14}
                        className="group-hover/btn:translate-x-1 transition-transform"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {events.length > 0 && (
          <div className="text-center mt-16">
            <button className="bg-[#C5A059] text-white px-12 py-4 rounded-sm font-bold tracking-[0.2em] hover:bg-[#b89658] transition-all shadow-xl uppercase text-xs">
              Consulter l'agenda complet
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default EventsSection;
