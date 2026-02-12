"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Loader2, LayoutGrid, List } from "lucide-react";
import { useEventStore } from "@/stores/eventStore";
import EventCard from "@/components/ui/EventCard";
import SearchInput from "@/components/ui/SearchInput";
import CustomSelect from "@/components/ui/CustomSelect";

export default function AllEventsPage() {
    const { events, isLoading, error, fetchPublishedEvents } = useEventStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState<string>("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    useEffect(() => {
        fetchPublishedEvents();
    }, [fetchPublishedEvents]);

    const categories = ["Formation", "Workshop", "Conférence", "Networking"];

    const filteredEvents = useMemo(() => {
        return events.filter((event) => {
            const matchesSearch =
                event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.location.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCategory = !activeCategory || event.category === activeCategory;

            return matchesSearch && matchesCategory;
        });
    }, [events, searchTerm, activeCategory]);

    return (
        <div className="min-h-screen bg-white">
            {/* Header Section */}
            <div className="pt-32 pb-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <span className="text-[#C5A059] text-xs font-bold tracking-[0.4em] uppercase block mb-4">
                        Catalogue Complet
                    </span>
                    <h1
                        className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-8 leading-tight"
                        style={{ fontFamily: "serif" }}
                    >
                        Tous nos <span className="text-[#C5A059] italic">Événements</span>
                    </h1>

                    {/* Premium Separator */}
                    <div className="w-20 h-1.5 bg-[#C5A059] mb-8"></div>

                    <p className="text-gray-500 font-light max-w-3xl text-lg leading-relaxed">
                        Explorez notre sélection exclusive de formations certifiantes, workshops immersifs et conférences internationales conçus pour les leaders de demain.
                    </p>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="pb-16 bg-[#FBFBFB] border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -translate-y-8">
                    {/* Search & Filter Bar */}
                    <div className="flex flex-col lg:flex-row gap-4 items-center mb-16">
                        {/* Search Input - Truly Full Width within the available space */}
                        <div className="flex-1 w-full">
                            <SearchInput
                                value={searchTerm}
                                onChange={setSearchTerm}
                                placeholder="Rechercher un titre, une ville ou un mot-clé..."
                                inputClassName="!py-3 border-none ring-1 ring-gray-100 focus:ring-[#C5A059]"
                            />
                        </div>

                        {/* Right Controls Container */}
                        <div className="flex items-center gap-4 w-full lg:w-auto shrink-0">
                            {/* View Mode Toggle */}
                            <div className="flex items-center bg-white border-none ring-1 ring-gray-100 rounded overflow-hidden">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-3 transition-all duration-300 ${viewMode === 'grid' ? 'bg-[#1A1A1A] text-white' : 'text-gray-400 hover:text-[#C5A059] hover:bg-gray-50'}`}
                                    title="Vue Grille"
                                >
                                    <LayoutGrid size={20} />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-3 transition-all duration-300 ${viewMode === 'list' ? 'bg-[#1A1A1A] text-white' : 'text-gray-400 hover:text-[#C5A059] hover:bg-gray-50'}`}
                                    title="Vue Liste"
                                >
                                    <List size={20} />
                                </button>
                            </div>
                            {/* Category Filter - Fixed width to maintain alignment */}
                            <div className="w-full md:w-52">
                                <CustomSelect
                                    options={categories}
                                    value={activeCategory}
                                    onChange={setActiveCategory}
                                    placeholder="Toutes les catégories"
                                    buttonClassName="!py-3 border-none ring-1 ring-gray-100"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Results Count & Meta */}
                    {!isLoading && (
                        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <h2 className="text-gray-600 text-lg flex items-center gap-2">
                                <span className="w-8 h-[3px] bg-[#C5A059]"></span>
                                {filteredEvents.length} Session{filteredEvents.length > 1 ? 's' : ''} Disponible{filteredEvents.length > 1 ? 's' : ''}
                            </h2>
                        </div>
                    )}

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-16 h-16 text-[#C5A059] animate-spin mb-6 opacity-80" />
                            <p className="text-gray-400 font-medium tracking-[0.2em] uppercase text-xs">Extraction des données...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-gray-100">
                            <p className="text-red-400 font-bold">{error}</p>
                        </div>
                    ) : filteredEvents.length === 0 ? (
                        <div className="text-center py-32 bg-white rounded-xl border border-dashed border-gray-200 shadow-sm">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: "serif" }}>Parcours introuvable</h3>
                            <p className="text-gray-500 font-light max-w-sm mx-auto mb-8">
                                Aucun événement ne correspond à vos critères de recherche. Essayez d'autres mots-clés ou élargissez vos catégories.
                            </p>
                            <button
                                onClick={() => { setSearchTerm(""); setActiveCategory(""); }}
                                className="bg-[#1A1A1A] text-white px-10 py-3 rounded-sm text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#C5A059] transition-all shadow-lg"
                            >
                                Réinitialiser le catalogue
                            </button>
                        </div>
                    ) : (
                        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10" : "flex flex-col gap-10 py-20"}>
                            {filteredEvents.map((event) => (
                                <EventCard key={event._id} event={event} layout={viewMode} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Section */}
            <footer className="bg-white border-t border-gray-100 py-10">
                <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-6">
                    <div className="flex items-center gap-1.5 grayscale opacity-30">
                        <span className="text-2xl font-black text-gray-900 tracking-tighter">EVENTIA</span>
                        <div className="w-2 h-2 bg-gray-900 rounded-full mt-2"></div>
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-[0.4em]">Excellence • Passion • Partage</p>
                </div>
            </footer>
        </div>
    );
}
