"use client";

import React from "react";
import { Calendar, MapPin, ChevronRight } from "lucide-react";
import { Event } from "@/lib/types";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";

interface EventCardProps {
    event: Event;
    layout?: "grid" | "list";
}

const STATIC_IMAGE =
    "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2069&auto=format&fit=crop";

const EventCard: React.FC<EventCardProps> = ({ event, layout = "grid" }) => {
    const { user } = useAuthStore();

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

    if (layout === "list") {
        return (
            <div className="group bg-white rounded border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row h-auto md:h-56">
                <div className="relative w-full md:w-72 overflow-hidden shrink-0">
                    <Link href={`/events/${event._id}`}>
                        <img
                            src={event.image || STATIC_IMAGE}
                            alt={event.title}
                            className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-700 cursor-pointer"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300"></div>
                    </Link>
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-0.5 rounded-sm text-[10px] font-bold text-[#1A1A1A] uppercase tracking-[0.2em] shadow-sm">
                        {event.category}
                    </div>
                </div>
                <div className="p-6 flex flex-col grow justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 text-xs text-[#C5A059] font-bold uppercase tracking-wider">
                                <Calendar size={12} /> {formatDate(event.date)}
                            </div>
                            <span className="text-sm font-medium text-gray-400">{event.price === 0 ? "Gratuit" : `${event.price} MAD`}</span>
                        </div>

                        <Link href={`/events/${event._id}`} className="block mb-2">
                            <h3
                                className="text-xl font-bold text-gray-900 group-hover:text-[#C5A059] transition-colors leading-tight cursor-pointer"
                                style={{ fontFamily: "serif" }}
                            >
                                {event.title}
                            </h3>
                        </Link>
                        <p className="text-sm text-gray-500 line-clamp-2 mb-4 font-light leading-relaxed">
                            {event.description}
                        </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                        <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1.5 uppercase tracking-wider">
                            <MapPin size={12} className="text-[#C5A059]" />
                            <span className="truncate max-w-[150px]">{event.location}</span>
                        </span>
                        <Link
                            href={`/events/${event._id}`}
                            className="text-[#1A1A1A] font-bold text-[10px] hover:text-[#C5A059] transition-colors flex items-center gap-1 uppercase tracking-[0.2em] group/btn"
                        >
                            {user?.role === 'ADMIN' ? "Gérer" : "Réserver"}
                            <ChevronRight
                                size={12}
                                className="group-hover/btn:translate-x-1 transition-transform"
                            />
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
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
                        <MapPin size={14} className="text-[#C5A059] shrink-0 mt-px" />
                        <span className="line-clamp-2 leading-tight">
                            {event.location}
                        </span>
                    </span>
                    <Link
                        href={`/events/${event._id}`}
                        className="text-[#1A1A1A] font-bold text-[10px] hover:text-[#C5A059] transition-colors flex items-center gap-1 uppercase tracking-[0.2em] group/btn shrink-0"
                    >
                        {user?.role === 'ADMIN' ? "Gérer" : "Réserver"}{" "}
                        <ChevronRight
                            size={14}
                            className="group-hover/btn:translate-x-1 transition-transform"
                        />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default EventCard;
