"use client";

import React, { useState, useEffect } from "react";
import {
    Search,
    Loader2,
    User,
    Mail,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    MapPin,
    Calendar,
    Trash2,
} from "lucide-react";
import {
    reservationService,
    Reservation,
} from "@/lib/services/reservationService";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Link from "next/link";
import { useToast } from "@/context/ToastContext";

const ReservationsList: React.FC = () => {
    const { toast } = useToast();
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState("");

    // Modal state
    const [modal, setModal] = useState<{
        isOpen: boolean;
        type: "CONFIRM" | "REJECT" | "CANCEL" | null;
        id: string;
        ticket: string;
    }>({
        isOpen: false,
        type: null,
        id: "",
        ticket: "",
    });

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            setLoading(true);
            const data = await reservationService.getAll();
            setReservations(data);
        } catch (err) {
            console.error("Failed to fetch reservations", err);
            setError("Impossible de charger les réservations");
        } finally {
            setLoading(false);
        }
    };

    const handleActionClick = (
        id: string,
        ticket: string,
        type: "CONFIRM" | "REJECT" | "CANCEL",
    ) => {
        setModal({ isOpen: true, type, id, ticket });
    };

    const executeAction = async () => {
        if (!modal.type || !modal.id) return;

        try {
            setActionLoading(modal.id);
            if (modal.type === "CONFIRM") {
                await reservationService.confirm(modal.id);
            } else if (modal.type === "REJECT") {
                await reservationService.reject(modal.id);
            } else if (modal.type === "CANCEL") {
                await reservationService.cancel(modal.id);
            }
            // Refresh list
            await fetchReservations();
            setModal({ isOpen: false, type: null, id: "", ticket: "" });

            const actionName = modal.type === 'CONFIRM' ? 'confirmée' : modal.type === 'REJECT' ? 'rejetée' : 'annulée';
            toast.success(`La réservation ${modal.ticket} a été ${actionName} avec succès.`, "Opération réussie");
        } catch (err) {
            console.error("Action failed", err);
            toast.error("Une erreur est survenue lors de l'exécution de l'action.", "Action échouée");
        } finally {
            setActionLoading(null);
        }
    };

    const filteredReservations = reservations.filter((r) => {
        const searchLower = searchTerm.toLowerCase();
        const user = r.userId as any;
        const event = r.eventId as any;

        return (
            r.ticketNumber?.toLowerCase().includes(searchLower) ||
            user?.first_name?.toLowerCase().includes(searchLower) ||
            user?.last_name?.toLowerCase().includes(searchLower) ||
            user?.email?.toLowerCase().includes(searchLower) ||
            event?.title?.toLowerCase().includes(searchLower)
        );
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "CONFIRMED":
                return (
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase text-green-600 bg-green-50 rounded">
                        Confirmé
                    </span>
                );
            case "PENDING":
                return (
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase text-yellow-600 bg-yellow-50 rounded">
                        En Attente
                    </span>
                );
            case "CANCELED":
                return (
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase text-red-600 bg-red-50 rounded">
                        Annulé
                    </span>
                );
            case "REJECTED":
                return (
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase text-gray-600 bg-gray-100 rounded">
                        Rejeté
                    </span>
                );
            default:
                return (
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase text-gray-600 bg-gray-50 rounded">
                        {status}
                    </span>
                );
        }
    };

    // Modal configuration based on type
    const getModalConfig = () => {
        switch (modal.type) {
            case "CONFIRM":
                return {
                    title: "Confirmer la réservation",
                    message: `Êtes-vous sûr de vouloir confirmer la réservation ${modal.ticket} ?`,
                    btnText: "Confirmer",
                    variant: "success" as const,
                    icon: <CheckCircle2 size={32} />
                };
            case "REJECT":
                return {
                    title: "Rejeter la réservation",
                    message: `Êtes-vous sûr de vouloir rejeter la réservation ${modal.ticket} ?`,
                    btnText: "Rejeter",
                    variant: "danger" as const,
                    icon: <XCircle size={32} />
                };
            case "CANCEL":
                return {
                    title: "Annuler la réservation",
                    message: `Êtes-vous sûr de vouloir annuler la réservation ${modal.ticket} ? Cette action est irréversible.`,
                    btnText: "Annuler",
                    variant: "danger" as const,
                    icon: <AlertTriangle size={32} />
                };
            default:
                return {
                    title: "",
                    message: "",
                    btnText: "",
                    variant: "primary" as const,
                };
        }
    };

    const modalConfig = getModalConfig();

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-200 rounded">
                <Loader2 className="w-8 h-8 text-[#C5A059] animate-spin mb-3" />
                <p className="text-gray-500 text-sm">Chargement des réservations...</p>
            </div>
        );
    }

    return (
        <>
            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8 mt-6">
                <div className="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto">
                    <div className="relative w-full md:w-80">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            size={18}
                        />
                        <input
                            type="text"
                            placeholder="Rechercher une réservation..."
                            className="w-full pl-10 pr-4 py-2.5 text-sm text-gray-700 bg-white border border-gray-200 rounded focus:outline-none focus:border-[#C5A059] transition-colors"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                Ticket
                            </th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                Client
                            </th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                Événement
                            </th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                Statut
                            </th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredReservations.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-6 py-10 text-center text-gray-400 text-sm"
                                >
                                    Aucune réservation trouvée.
                                </td>
                            </tr>
                        ) : (
                            filteredReservations.map((r) => {
                                const user = r.userId as any;
                                const event = r.eventId as any;
                                return (
                                    <tr
                                        key={r._id}
                                        className="hover:bg-gray-50/50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-xs font-bold text-gray-600">
                                                {r.ticketNumber || "N/A"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                                    <User size={14} />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-gray-900">
                                                        {user?.first_name} {user?.last_name}
                                                    </p>
                                                    <p className="text-[10px] text-gray-400">
                                                        {user?.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div
                                                    className="text-xs font-bold text-gray-900 line-clamp-1 w-48"
                                                    title={event?.title}
                                                >
                                                    {event?.title}
                                                </div>
                                                <div className="flex items-center gap-1 text-[10px] text-gray-500">
                                                    <MapPin size={10} /> {event?.location}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <Calendar size={12} />
                                                {new Date(event?.date).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{getStatusBadge(r.status)}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {r.status === "PENDING" && (
                                                    <>
                                                        <button
                                                            onClick={() =>
                                                                handleActionClick(
                                                                    r._id,
                                                                    r.ticketNumber || "",
                                                                    "CONFIRM",
                                                                )
                                                            }
                                                            disabled={actionLoading === r._id}
                                                            className="p-1.5 text-gray-400 hover:text-[#C5A059] transition-colors bg-white border border-gray-100 rounded"
                                                            title="Confirmer"
                                                        >
                                                            <CheckCircle2 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleActionClick(
                                                                    r._id,
                                                                    r.ticketNumber || "",
                                                                    "REJECT",
                                                                )
                                                            }
                                                            disabled={actionLoading === r._id}
                                                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors bg-white border border-gray-100 rounded"
                                                            title="Rejeter"
                                                        >
                                                            <XCircle size={16} />
                                                        </button>
                                                    </>
                                                )}
                                                {(r.status === "CONFIRMED" ||
                                                    r.status === "PENDING") && (
                                                        <button
                                                            onClick={() =>
                                                                handleActionClick(
                                                                    r._id,
                                                                    r.ticketNumber || "",
                                                                    "CANCEL",
                                                                )
                                                            }
                                                            disabled={actionLoading === r._id}
                                                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors bg-white border border-gray-100 rounded"
                                                            title="Annuler"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
                <p>Total : {filteredReservations.length} réservation(s)</p>
                <div className="flex gap-2">
                    <button
                        className="px-4 py-2 border border-gray-200 rounded hover:cursor-not-allowed text-xs font-bold disabled:opacity-50 bg-white"
                        disabled
                    >
                        Précédent
                    </button>
                    <button className="px-4 py-2 border border-gray-200 rounded hover:cursor-pointer text-xs font-bold bg-white">
                        Suivant
                    </button>
                </div>
            </div>

            <ConfirmModal
                isOpen={modal.isOpen}
                onClose={() => setModal({ ...modal, isOpen: false })}
                onConfirm={executeAction}
                title={modalConfig.title}
                message={modalConfig.message}
                confirmText={modalConfig.btnText}
                cancelText="Retour"
                variant={modalConfig.variant}
                icon={(modalConfig as any).icon}
                isLoading={!!actionLoading}
            />
        </>
    );
};

export default ReservationsList;
