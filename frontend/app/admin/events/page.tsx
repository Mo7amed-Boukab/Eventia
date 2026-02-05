"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
    Plus,
    Search,
    ChevronDown,
    MoreVertical,
    Edit,
    Trash2,
    Eye,
    Calendar,
    MapPin,
    Users
} from "lucide-react";

// Mock data for events
const MOCK_EVENTS = [
    {
        id: "1",
        title: "Masterclass Leadership & Management",
        date: "12 Mai 2026",
        location: "Casablanca, Maroc",
        category: "Formation",
        status: "Confirmé",
        participants: 45,
        price: "1500 MAD",
        image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: "2",
        title: "Atelier Design Thinking & Innovation",
        date: "18 Juin 2026",
        location: "Rabat, Maroc",
        category: "Workshop",
        status: "Planifié",
        participants: 28,
        price: "850 MAD",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: "3",
        title: "Conférence Tech & Futur of Work",
        date: "05 Juil 2026",
        location: "Marrakech, Maroc",
        category: "Conférence",
        status: "Complet",
        participants: 120,
        price: "Gratuit",
        image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=2070&auto=format&fit=crop"
    }
];

// Custom Select Component
interface CustomSelectProps {
    options: string[];
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, value, onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between gap-3 px-4 py-2.5 bg-white border border-gray-200 rounded text-sm font-medium text-gray-700 min-w-[160px] hover:border-[#C5A059] transition-all"
            >
                <span className={value ? "text-gray-900" : "text-gray-500"}>
                    {value || placeholder}
                </span>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-100 rounded shadow-xl z-50 py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                    {options.map((option) => (
                        <button
                            key={option}
                            onClick={() => {
                                onChange(option);
                                setIsOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#C5A059] transition-colors"
                        >
                            {option}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const EventsPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [category, setCategory] = useState("");
    const [status, setStatus] = useState("");

    const categories = ["Formation", "Workshop", "Conférence"];
    const statuses = ["Confirmé", "Planifié", "Complet"];

    return (
        <div className="px-8 py-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-2xl font-bold text-[#1A1A1A] mb-1" style={{ fontFamily: "serif" }}>
                        Gestion des Événements
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Gérez vos événements et suivez les participations.
                    </p>
                </div>
            </div>

            {/* Filters & Search - No Background Container */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8 mt-6">
                <div className="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Rechercher un événement..."
                            className="w-full pl-10 pr-4 py-2.5 text-sm text-gray-700 bg-white border border-gray-200 rounded focus:outline-none focus:border-[#C5A059] transition-colors"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <CustomSelect
                            options={categories}
                            value={category}
                            onChange={setCategory}
                            placeholder="Toutes les catégories"
                        />
                        <CustomSelect
                            options={statuses}
                            value={status}
                            onChange={setStatus}
                            placeholder="Tous les statuts"
                        />
                    </div>
                </div>

                <Link href="/admin/events/create" className="flex items-center gap-2 bg-[#1A1A1A] text-white px-6 py-2.5 rounded text-sm font-bold tracking-wide hover:bg-gray-800 transition-colors shadow-lg w-full md:w-auto justify-center">
                    <Plus size={18} /> Créer un Événement
                </Link>
            </div>

            {/* Events Table/List */}
            <div className="bg-white rounded border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Événement</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Date & Lieu</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Catégorie</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Participants</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {MOCK_EVENTS.map((event) => (
                            <tr key={event.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <img src={event.image} alt={event.title} className="w-10 h-10 rounded object-cover border border-gray-100" />
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-900">{event.title}</h3>
                                            <p className="text-xs text-[#C5A059] font-medium">{event.price}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-xs text-gray-600">
                                            <Calendar size={14} className="text-[#C5A059]" /> {event.date}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-600">
                                            <MapPin size={14} className="text-[#C5A059]" /> {event.location}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-0.5 text-[9px] font-bold uppercase bg-gray-100 text-gray-600 rounded">
                                        {event.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                                        <Users size={16} className="text-gray-400" /> {event.participants}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase ${event.status === "Confirmé" ? "text-green-600" :
                                        event.status === "Planifié" ? "text-blue-600" :
                                            "text-orange-600"
                                        }`}>
                                        {event.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors bg-white border border-gray-100 rounded">
                                            <Eye size={16} />
                                        </button>
                                        <button className="p-1.5 text-gray-400 hover:text-[#C5A059] transition-colors bg-white border border-gray-100 rounded">
                                            <Edit size={16} />
                                        </button>
                                        <button className="p-1.5 text-gray-400 hover:text-red-500 transition-colors bg-white border border-gray-100 rounded">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
                <p>Affichage de 1-3 sur 3 événements</p>
                <div className="flex gap-2">
                    <button className="px-4 py-2 border border-gray-200 rounded hover:cursor-not-allowed text-xs font-bold disabled:opacity-50 bg-white" disabled>Précédent</button>
                    <button className="px-4 py-2 border border-gray-200 rounded hover:cursor-pointer text-xs font-bold bg-white">Suivant</button>
                </div>
            </div>
        </div>
    );
};

export default EventsPage;
