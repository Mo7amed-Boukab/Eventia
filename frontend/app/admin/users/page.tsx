import React from "react";
import UsersList from "@/components/admin/UsersList";

export const metadata = {
    title: "Gestion des Utilisateurs | Admin | Eventia",
    description: "Gérez les membres et leurs rôles sur Eventia.",
};

export default function AdminUsersPage() {
    return (
        <div className="px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-2xl font-bold text-[#1A1A1A] mb-1" style={{ fontFamily: "serif" }}>
                        Gestion des Utilisateurs
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Gérez les membres et leurs rôles sur la plateforme.
                    </p>
                </div>
            </div>

            <UsersList />
        </div>
    );
}
