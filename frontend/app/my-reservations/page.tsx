"use client";

import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useToastStore } from "@/stores/toastStore";
import { useReservationStore } from "@/stores/reservationStore";
import { Reservation } from "@/lib/services/reservationService";
import {
    Calendar,
    MapPin,
    Ticket,
    Clock,
    ChevronRight,
    Loader2,
    AlertCircle,
    CheckCircle2,
    XCircle,
    ArrowLeft,
    Download,
    Info
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ConfirmModal from "@/components/ui/ConfirmModal";

const MyReservationsPage = () => {
    const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
    const toast = useToastStore();
    const router = useRouter();
    const {
        myReservations: reservations,
        isMyLoading: loading,
        actionLoading,
        fetchMyReservations,
        cancelReservation,
        downloadTicket,
    } = useReservationStore();

    const [activeTab, setActiveTab] = useState<'ALL' | 'CONFIRMED' | 'PENDING' | 'OTHERS'>('ALL');
    const [cancelModal, setCancelModal] = useState<{ isOpen: boolean; id: string; ticket: string }>({
        isOpen: false,
        id: "",
        ticket: ""
    });

    useEffect(() => {
        if (!authLoading) {
            if (!isAuthenticated) {
                router.push("/login?redirect=/my-reservations");
            } else if (user?.role === 'ADMIN') {
                router.push("/admin/dashboard");
            }
        }
    }, [authLoading, isAuthenticated, user, router]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchMyReservations();
        }
    }, [isAuthenticated, fetchMyReservations]);

    const handleCancelClick = (id: string, ticket: string) => {
        setCancelModal({ isOpen: true, id, ticket });
    };

    const handleConfirmCancel = async () => {
        try {
            await cancelReservation(cancelModal.id);
            toast.success("Votre réservation a été annulée avec succès.");
            setCancelModal({ isOpen: false, id: "", ticket: "" });
            await fetchMyReservations();
        } catch (err) {
            console.error("Cancel failed", err);
            toast.error("Une erreur est survenue lors de l'annulation.");
        }
    };

    const handleDownloadTicket = async (id: string, ticketNum: string) => {
        try {
            await downloadTicket(id, ticketNum);
            toast.success("Votre billet est prêt ! Ouverture du téléchargement.");
        } catch (err) {
            console.error("Download failed", err);
            toast.error("Impossible de générer votre billet pour le moment.");
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "CONFIRMED":
                return {
                    bg: "bg-green-50",
                    text: "text-green-700",
                    border: "border-green-100",
                    icon: <CheckCircle2 size={12} />,
                    label: "Confirmée"
                };
            case "PENDING":
                return {
                    bg: "bg-amber-50",
                    text: "text-amber-700",
                    border: "border-amber-100",
                    icon: <Clock size={12} />,
                    label: "En attente"
                };
            case "REJECTED":
                return {
                    bg: "bg-red-50",
                    text: "text-red-700",
                    border: "border-red-100",
                    icon: <XCircle size={12} />,
                    label: "Rejetée"
                };
            case "CANCELED":
                return {
                    bg: "bg-gray-50",
                    text: "text-gray-600",
                    border: "border-gray-100",
                    icon: <AlertCircle size={12} />,
                    label: "Annulée"
                };
            default:
                return {
                    bg: "bg-blue-50",
                    text: "text-blue-700",
                    border: "border-blue-100",
                    icon: <Info size={12} />,
                    label: status
                };
        }
    };

    const filteredReservations = reservations.filter(r => {
        if (activeTab === 'ALL') return true;
        if (activeTab === 'CONFIRMED') return r.status === 'CONFIRMED';
        if (activeTab === 'PENDING') return r.status === 'PENDING';
        if (activeTab === 'OTHERS') return r.status === 'CANCELED' || r.status === 'REJECTED';
        return true;
    });

    if (authLoading || (loading && reservations.length === 0)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-[#C5A059] animate-spin mx-auto mb-4" />
                    <p className="text-gray-500 font-serif italic">Chargement de vos privilèges...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFBF7] pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-[#C5A059] transition-colors mb-6 group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Retour au site</span>
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="bg-[#C5A059] w-8 h-[1px]"></span>
                                <span className="text-[#C5A059] text-[10px] font-bold uppercase tracking-[0.4em]">Espace Membre</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900" style={{ fontFamily: 'serif' }}>
                                Mes <span className="text-[#C5A059] italic">Réservations</span>
                            </h1>
                        </div>
                        <div className="bg-white px-6 py-4 border border-[#C5A059]/10 rounded">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-1">Total</p>
                            <p className="text-xl font-medium text-gray-900">{reservations.length} <span className="text-sm font-light text-gray-400">Événements</span></p>
                        </div>
                    </div>
                </div>

                {/* Filter Tabs */}
                {reservations.length > 0 && (
                    <div className="flex flex-wrap items-center gap-4 mb-10 border-b border-gray-100 pb-1">
                        {[
                            { id: 'ALL', label: 'Toutes' },
                            { id: 'CONFIRMED', label: 'Confirmées' },
                            { id: 'PENDING', label: 'En attente' },
                            { id: 'OTHERS', label: 'Historique' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`pb-4 px-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative ${activeTab === tab.id
                                    ? "text-[#C5A059]"
                                    : "text-gray-400 hover:text-gray-600"
                                    }`}
                            >
                                {tab.label}
                                {activeTab === tab.id && (
                                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C5A059] animate-in fade-in slide-in-from-bottom-1" />
                                )}
                            </button>
                        ))}
                    </div>
                )}

                {/* Reservations List */}
                {filteredReservations.length === 0 ? (
                    <div className="bg-white border border-[#C5A059]/10 rounded-sm p-16 text-center">
                        <div className="w-20 h-20 bg-[#FDFBF7] rounded-full flex items-center justify-center mx-auto mb-6 border border-[#C5A059]/5">
                            <Ticket size={32} className="text-[#C5A059] opacity-20" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'serif' }}>
                            {activeTab === 'ALL' ? "Aucune réservation trouvée" : "Aucun résultat pour ce filtre"}
                        </h3>
                        <p className="text-gray-500 font-light max-w-xs mx-auto mb-8">
                            {activeTab === 'ALL'
                                ? "Il semble que vous n'ayez pas encore réservé de place pour nos événements exclusifs."
                                : "Aucune de vos réservations ne correspond à ce statut actuellement."
                            }
                        </p>
                        {activeTab === 'ALL' && (
                            <Link
                                href="/#events"
                                className="inline-flex items-center gap-3 px-8 py-4 bg-[#1A1A1A] text-white rounded-sm text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#C5A059] transition-all shadow-xl"
                            >
                                Découvrir les événements
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {filteredReservations.map((r) => {
                            const event = r.eventId as any;
                            const statusStyle = getStatusStyles(r.status);
                            const eventDate = new Date(event?.date);

                            return (
                                <div
                                    key={r._id}
                                    className="group bg-white border border-gray-100 rounded-sm overflow-hidden hover:border-[#C5A059]/30 transition-all hover:shadow-xl flex flex-col md:flex-row"
                                >
                                    {/* Event Image */}
                                    <div className="w-full md:w-64 h-48 md:h-auto relative overflow-hidden shrink-0">
                                        <img
                                            src={event?.image || "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2069&auto=format&fit=crop"}
                                            alt={event?.title}
                                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all" />
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest">
                                                {event?.category || "Événement"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className={`px-2 py-0.5 rounded-full border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider`}>
                                                        {statusStyle.icon}
                                                        {statusStyle.label}
                                                    </div>
                                                </div>
                                                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 group-hover:text-[#C5A059] transition-colors" style={{ fontFamily: 'serif' }}>
                                                    {event?.title}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-500 text-xs font-light">
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar size={14} className="text-[#C5A059]" />
                                                        {eventDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <MapPin size={14} className="text-[#C5A059]" />
                                                        {event?.location}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1">Billet ID</p>
                                                <p className="text-sm font-bold text-[#1A1A1A] bg-gray-50 px-3 py-1 rounded-sm border border-gray-100 flex items-center gap-2">
                                                    <Ticket size={14} className="text-[#C5A059]" />
                                                    {r.ticketNumber}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-gray-50">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Réservé le :</span>
                                                <span className="text-[10px] font-medium text-gray-600">
                                                    {new Date(r.createdAt).toLocaleDateString('fr-FR')}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                {(r.status === 'CONFIRMED' || r.status === 'PENDING') && (
                                                    <button
                                                        onClick={() => handleCancelClick(r._id, r.ticketNumber || "")}
                                                        className="px-6 py-2.5 text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all rounded-sm"
                                                    >
                                                        Annuler la place
                                                    </button>
                                                )}

                                                {r.status === 'CONFIRMED' && (
                                                    <button
                                                        onClick={() => handleDownloadTicket(r._id, r.ticketNumber || "")}
                                                        disabled={!!actionLoading}
                                                        className="flex items-center gap-2 px-6 py-2.5 bg-[#1A1A1A] text-white rounded-sm text-[9px] font-bold uppercase tracking-[0.2em] hover:bg-[#C5A059] transition-all shadow-lg disabled:opacity-50"
                                                    >
                                                        {actionLoading === r._id ? (
                                                            <Loader2 size={14} className="animate-spin" />
                                                        ) : (
                                                            <Download size={14} />
                                                        )}
                                                        {actionLoading === r._id ? "Génération..." : "Télécharger Billet"}
                                                    </button>
                                                )}

                                                <Link
                                                    href={`/events/${event?._id}`}
                                                    className="inline-flex items-center gap-2 text-[#C5A059] hover:text-[#1A1A1A] transition-colors text-[9px] font-bold uppercase tracking-[0.2em]"
                                                >
                                                    Voir événement
                                                    <ChevronRight size={14} />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Cancel Confirmation Modal */}
            <ConfirmModal
                isOpen={cancelModal.isOpen}
                onClose={() => setCancelModal({ isOpen: false, id: "", ticket: "" })}
                onConfirm={handleConfirmCancel}
                title="Annuler la réservation"
                message={`Êtes-vous sûr de vouloir annuler votre place pour la réservation ${cancelModal.ticket} ?`}
                confirmText="Oui, annuler"
                cancelText="Garder ma place"
                variant="danger"
                isLoading={!!actionLoading}
            />
        </div>
    );
};

export default MyReservationsPage;
