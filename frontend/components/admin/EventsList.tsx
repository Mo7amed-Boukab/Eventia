"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
    Plus,
    Search,
    ChevronDown,
    Edit,
    Trash2,
    Eye,
    Calendar,
    MapPin,
    Users,
    Loader2,
    AlertCircle
} from "lucide-react";
import { eventService } from "@/lib/services/eventService";
import { Event } from "@/lib/types";
import ConfirmModal from "@/components/ui/ConfirmModal";

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
                type="button"
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
                    <button
                        type="button"
                        onClick={() => {
                            onChange("");
                            setIsOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-[#C5A059] transition-colors italic border-b border-gray-50 mb-1"
                    >
                        Toutes les options
                    </button>
                    {options.map((option) => (
                        <button
                            key={option}
                            type="button"
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

const EventsList: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [category, setCategory] = useState("");
    const [status, setStatus] = useState("");

    // Confirmation Modal State
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string; title: string }>({
        isOpen: false,
        id: "",
        title: ""
    });
    const [isDeleting, setIsDeleting] = useState(false);

    const categories = ["Formation", "Workshop", "Conférence", "Networking"];
    const statuses = ["DRAFT", "PUBLISHED", "CANCELED"];

    // Constant image as requested by user
    const STATIC_IMAGE = "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2069&auto=format&fit=crop";

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const data = await eventService.getAll();
            setEvents(data);
            setError("");
        } catch (err: any) {
            console.error("Error fetching events:", err);
            setError("Impossible de charger les événements.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (id: string, title: string) => {
        setDeleteModal({ isOpen: true, id, title });
    };

    const executeDelete = async () => {
        try {
            setIsDeleting(true);
            await eventService.delete(deleteModal.id);
            setEvents(prev => prev.filter(e => e._id !== deleteModal.id));
            setDeleteModal({ isOpen: false, id: "", title: "" });
        } catch (err) {
            console.error("Error deleting event:", err);
        } finally {
            setIsDeleting(false);
        }
    };

    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            return new Intl.DateTimeFormat('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }).format(date);
        } catch (e) {
            return dateStr;
        }
    };

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = category ? event.category === category : true;
        const matchesStatus = status ? event.status === status : true;
        return matchesSearch && matchesCategory && matchesStatus;
    });

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-200 rounded">
                <Loader2 className="w-8 h-8 text-[#C5A059] animate-spin mb-3" />
                <p className="text-gray-500 text-sm">Chargement des événements...</p>
            </div>
        );
    }

    return (
        <>
            {/* Filters & Search */}
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

                <Link href="/admin/events/create" className="flex items-center gap-2 bg-[#C5A059] rounded text-white px-6 py-3 text-[11px] font-semibold uppercase tracking-widest hover:bg-[#b08d4a] hover:cursor-pointer hover:shadow-xl shadow-[#C5A059]/20 transition-all w-full md:w-auto justify-center">
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
                        {filteredEvents.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-10 text-center text-gray-400 text-sm">
                                    Aucun événement trouvé.
                                </td>
                            </tr>
                        ) : (
                            filteredEvents.map((event) => (
                                <tr key={event._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <img src={STATIC_IMAGE} alt={event.title} className="w-10 h-10 rounded object-cover border border-gray-100" />
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{event.title}</h3>
                                                <p className="text-xs text-[#C5A059] font-medium">
                                                    {event.price === 0 ? "Gratuit" : `${event.price} MAD`}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                                <Calendar size={14} className="text-[#C5A059]" /> {formatDate(event.date)}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                                <MapPin size={14} className="text-[#C5A059]" /> <span className="line-clamp-1">{event.location}</span>
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
                                        <span className={`px-2.5 py-1 text-[10px] font-bold uppercase ${event.status === "PUBLISHED" ? "text-green-600 bg-green-50" :
                                            event.status === "DRAFT" ? "text-blue-600 bg-blue-50" :
                                                "text-red-600 bg-red-50"
                                            } rounded`}>
                                            {event.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/events/${event._id}`} className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors bg-white border border-gray-100 rounded">
                                                <Eye size={16} />
                                            </Link>
                                            <Link href={`/admin/events/edit/${event._id}`} className="p-1.5 text-gray-400 hover:text-[#C5A059] transition-colors bg-white border border-gray-100 rounded">
                                                <Edit size={16} />
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteClick(event._id, event.title)}
                                                className="p-1.5 text-gray-400 hover:text-red-500 transition-colors bg-white border border-gray-100 rounded"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
                <p>Total : {filteredEvents.length} événement(s)</p>
                <div className="flex gap-2">
                    <button className="px-4 py-2 border border-gray-200 rounded hover:cursor-not-allowed text-xs font-bold disabled:opacity-50 bg-white" disabled>Précédent</button>
                    <button className="px-4 py-2 border border-gray-200 rounded hover:cursor-pointer text-xs font-bold bg-white">Suivant</button>
                </div>
            </div>

            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
                onConfirm={executeDelete}
                title="Supprimer l'événement"
                message={`Êtes-vous sûr de vouloir supprimer définitivement l'événement "${deleteModal.title}" ? Cette action est irréversible.`}
                confirmText="Oui, supprimer"
                cancelText="Annuler"
                variant="danger"
                isLoading={isDeleting}
            />
        </>
    );
};

export default EventsList;
