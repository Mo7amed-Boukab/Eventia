"use client";

import React, { useEffect, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { Event } from "@/lib/types";
import Link from "next/link";
import { useEventStore } from "@/stores/eventStore";
import EventCard from "@/components/ui/EventCard";

const EventsSection: React.FC = () => {
  const { events: allEvents, isLoading, error, fetchPublishedEvents } = useEventStore();

  useEffect(() => {
    fetchPublishedEvents();
  }, [fetchPublishedEvents]);

  // Sort by date (closest first) and take first 3
  const events = useMemo(() => {
    return [...allEvents]
      .sort(
        (a: Event, b: Event) =>
          new Date(a.date).getTime() - new Date(b.date).getTime(),
      )
      .slice(0, 3);
  }, [allEvents]);

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
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}

        {allEvents.length > 0 && (
          <div className="text-center mt-16">
            <Link href="/events">
              <button className="bg-[#C5A059] text-white px-12 py-4 rounded-sm font-bold tracking-[0.2em] hover:bg-[#B08D45] transition-all shadow-xl uppercase text-xs">
                Consulter l'agenda complet
              </button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default EventsSection;
