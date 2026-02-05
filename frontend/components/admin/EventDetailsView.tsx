"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
    Calendar,
    MapPin,
    DollarSign,
    Users,
    ArrowLeft,
    Edit,
    Clock,
    Tag,
    ChevronRight,
    Loader2,
    AlertCircle,
    Info,
    CheckCircle2,
    XCircle
} from "lucide-react";
import { eventService } from "@/lib/services/eventService";
import { Event, EventStatus } from "@/lib/types";

export default function EventDetailsView() {
    const router = useRouter();
    const { id } = useParams();
    const [event, setEvent] = useState<Event | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const STATIC_IMAGE = "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2069&auto=format&fit=crop";

    useEffect(() => {
        if (id) {
            fetchEvent();
        }
    }, [id]);

    const fetchEvent = async () => {
        try {
            setIsLoading(true);
            const data = await eventService.getById(id as string);
            setEvent(data);
        } catch (err: any) {
            console.error("Error fetching event:", err);
            setError("Impossible de charger les détails de l'événement.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-[#C5A059] animate-spin mb-4" />
                <p className="text-gray-500 font-medium italic italic">Chargement des détails de l'événement...</p>
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle size={32} className="text-red-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Erreur lors du chargement</h2>
                <p className="text-gray-500 mb-6 max-w-md">{error || "L'événement demandé est introuvable."}</p>
                <button
                    onClick={() => router.push("/admin/events")}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded text-xs font-bold uppercase tracking-widest hover:bg-black transition-all"
                >
                    <ArrowLeft size={14} /> Retour à la liste
                </button>
            </div>
        );
    }

    const formatDate = (dateStr: string) => {
        return new Intl.DateTimeFormat('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(new Date(dateStr));
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header / Breadcrumbs & Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                        <Link href="/admin/events" className="hover:text-[#C5A059] transition-colors">Événements</Link>
                        <ChevronRight size={10} />
                        <span className="text-[#C5A059]">Détails</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold text-[#1A1A1A]" style={{ fontFamily: "serif" }}>
                            {event.title}
                        </h1>
                        <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase ${event.status === EventStatus.PUBLISHED ? "bg-green-50 text-green-600" :
                            event.status === EventStatus.DRAFT ? "bg-blue-50 text-blue-600" :
                                "bg-red-50 text-red-600"
                            }`}>
                            {event.status}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.push("/admin/events")}
                        className="flex items-center gap-2 px-5 py-2.5 text-[11px] font-bold rounded text-gray-500 bg-white border border-gray-200 uppercase tracking-widest hover:bg-gray-50 transition-all"
                    >
                        <ArrowLeft size={14} /> Retour
                    </button>
                    <Link
                        href={`/admin/events/edit/${event._id}`}
                        className="flex items-center gap-2 bg-[#C5A059] rounded text-white px-6 py-2.5 text-[11px] font-semibold uppercase tracking-widest hover:bg-[#b08d4a] transition-all hover:shadow-xl shadow-[#C5A059]/20"
                    >
                        <Edit size={14} /> Modifier
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content (Left Column) */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Event Banner Image */}
                    <div className="relative aspect-video rounded overflow-hidden shadow-sm border border-gray-100 bg-white p-2">
                        <img
                            src={STATIC_IMAGE}
                            alt={event.title}
                            className="w-full h-full object-cover rounded"
                        />
                        {event.price === 0 && (
                            <div className="absolute top-6 right-6 bg-green-500 text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
                                Gratuit
                            </div>
                        )}
                    </div>

                    {/* Description Section */}
                    <div className="bg-white p-8 border border-gray-200 space-y-6">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Info size={14} className="text-[#C5A059]" /> Description de l'événement
                        </h3>
                        <div className="prose prose-sm max-w-none text-gray-600 leading-loose">
                            {event.description.split('\n').map((para, i) => (
                                <p key={i} className="mb-4 text-justify font-light">{para}</p>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Info (Right Column) */}
                <div className="space-y-6">
                    {/* Key Info Card */}
                    <div className="bg-white border border-gray-200 overflow-hidden">
                        <div className="p-6 space-y-6">
                            <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-widest pb-4 border-b border-gray-50">
                                Informations Clés
                            </h3>

                            <div className="space-y-5">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded bg-[#FDFBF7] flex items-center justify-center flex-shrink-0">
                                        <Calendar size={18} className="text-[#C5A059]" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Date</p>
                                        <p className="text-sm font-medium text-gray-900">{formatDate(event.date)}</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded bg-[#FDFBF7] flex items-center justify-center flex-shrink-0">
                                        <Clock size={18} className="text-[#C5A059]" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Heure</p>
                                        <p className="text-sm font-medium text-gray-900">{event.time}</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded bg-[#FDFBF7] flex items-center justify-center flex-shrink-0">
                                        <MapPin size={18} className="text-[#C5A059]" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Localisation</p>
                                        <p className="text-sm font-medium text-gray-900 leading-snug">{event.location}</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded bg-[#FDFBF7] flex items-center justify-center flex-shrink-0">
                                        <Tag size={18} className="text-[#C5A059]" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Catégorie</p>
                                        <p className="text-sm font-medium text-gray-900">{event.category}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#1A1A1A] p-6 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Tarif</p>
                                <p className="text-xl font-bold text-white">
                                    {event.price === 0 ? "Gratuit" : `${event.price} MAD`}
                                </p>
                            </div>
                            <DollarSign size={24} className="text-[#C5A059] opacity-80" />
                        </div>
                    </div>

                    {/* Stats Card */}
                    <div className="bg-white p-6 border border-gray-200 space-y-6">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Users size={14} className="text-[#C5A059]" /> Statistiques
                        </h3>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500 font-light italic">Participants inscrits</span>
                                <span className="text-lg font-bold text-gray-900">{event.participants || 0}</span>
                            </div>

                            {/* Simple Progress Bar */}
                            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                <div
                                    className="bg-[#C5A059] h-full"
                                    style={{ width: `${event.maxParticipants ? ((event.participants || 0) / event.maxParticipants) * 100 : 0}%` }}
                                />
                            </div>

                            <p className="text-[10px] text-gray-400 font-medium italic">
                                {event.maxParticipants ? `${event.maxParticipants - (event.participants || 0)} places restantes` : "Capacité illimitée"}
                            </p>
                        </div>
                    </div>

                    {/* Status Summary */}
                    <div className={`p-6 border rounded ${event.status === EventStatus.PUBLISHED ? "bg-green-50/30 border-green-100" :
                        event.status === EventStatus.DRAFT ? "bg-blue-50/30 border-blue-100" :
                            "bg-red-50/30 border-red-100"
                        }`}>
                        <div className="flex items-center gap-3 mb-3">
                            {event.status === EventStatus.PUBLISHED ? <CheckCircle2 size={16} className="text-green-500" /> :
                                event.status === EventStatus.DRAFT ? <Info size={16} className="text-blue-500" /> :
                                    <XCircle size={16} className="text-red-500" />}
                            <p className="text-xs font-bold uppercase tracking-widest">
                                {event.status === EventStatus.PUBLISHED ? "Public" :
                                    event.status === EventStatus.DRAFT ? "Privé (Brouillon)" :
                                        "Annulé"}
                            </p>
                        </div>
                        <p className="text-[11px] text-gray-500 leading-relaxed font-light italic">
                            {event.status === EventStatus.PUBLISHED ? "L'événement est visible par tous les utilisateurs sur la plateforme." :
                                event.status === EventStatus.DRAFT ? "Seul l'administrateur peut voir cet événement. Publiez-le pour le rendre accessible." :
                                    "L'événement a été annulé et n'accepte plus d'inscriptions."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
