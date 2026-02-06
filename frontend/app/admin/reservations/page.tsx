import React from "react";
import ReservationsList from "@/components/admin/ReservationsList";

export const metadata = {
    title: "Gestion des Réservations | Admin | Eventia",
    description: "Consultez et modifiez le statut des réservations clients.",
};

export default function ReservationsPage() {
    return (
        <div className="px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-2xl font-bold text-[#1A1A1A] mb-1" style={{ fontFamily: "serif" }}>
                        Gestion des Réservations
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Consultez et modifiez le statut des réservations clients.
                    </p>
                </div>
            </div>

            <ReservationsList />
        </div>
    );
}
