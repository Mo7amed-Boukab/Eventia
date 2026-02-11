"use client";

import React, { useState, useEffect } from "react";
import {
    Search,
    Trash2,
    Mail,
    Calendar,
    Loader2,
    AlertCircle,
} from "lucide-react";
import { userService } from "@/lib/services/userService";
import { User } from "@/lib/types";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useToast } from "@/context/ToastContext";

const UsersList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const { toast } = useToast();

    // Modal actions
    const [modal, setModal] = useState<{
        isOpen: boolean;
        userId: string;
        userName: string;
    }>({
        isOpen: false,
        userId: "",
        userName: "",
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await userService.getAll();
            setUsers(data);
            setError("");
        } catch (err) {
            console.error("Error fetching users:", err);
            setError("Impossible de charger les utilisateurs.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async () => {
        try {
            await userService.delete(modal.userId);
            setUsers(users.filter((u) => ((u as any)._id || u.id) !== modal.userId));
            toast.success("Utilisateur supprimé avec succès");
            setModal({ ...modal, isOpen: false });
        } catch (err) {
            toast.error("Erreur lors de la suppression");
        }
    };

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-200 rounded">
                <Loader2 className="w-8 h-8 text-[#C5A059] animate-spin mb-3" />
                <p className="text-gray-500 text-sm">Chargement des membres...</p>
            </div>
        );
    }

    return (
        <>
            {/* Filters & Search - Matching Events design */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8 mt-6">
                <div className="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto">
                    <div className="relative w-full md:w-80">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            size={18}
                        />
                        <input
                            type="text"
                            placeholder="Rechercher par nom, email..."
                            className="w-full pl-10 pr-4 py-2.5 text-sm text-gray-700 bg-white border border-gray-200 rounded focus:outline-none focus:border-[#C5A059] transition-colors"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {error ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-200 rounded">
                    <AlertCircle className="w-12 h-12 text-red-400 mb-3" />
                    <p className="text-red-700 font-medium">{error}</p>
                    <button
                        onClick={fetchUsers}
                        className="mt-4 text-sm text-[#C5A059] hover:underline"
                    >
                        Réessayer
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded border border-gray-200 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                    Utilisateur
                                </th>
                                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                    Date d'inscription
                                </th>
                                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-gray-400 text-sm">
                                        Aucun utilisateur trouvé.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr
                                        key={(user as any)._id || user.id}
                                        className="hover:bg-gray-50/50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059] font-bold text-xs border border-[#C5A059]/20">
                                                    {user.first_name[0]}
                                                    {user.last_name[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {user.first_name} {user.last_name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                                <Calendar size={14} className="text-[#C5A059]" />
                                                {(user as any).createdAt ? new Date((user as any).createdAt).toLocaleDateString("fr-FR", {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                }) : 'Date inconnue'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() =>
                                                        setModal({
                                                            isOpen: true,
                                                            userId: (user as any)._id || user.id,
                                                            userName: `${user.first_name} ${user.last_name}`,
                                                        })
                                                    }
                                                    title="Supprimer"
                                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 border border-gray-100 rounded transition-all bg-white"
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
            )}

            {/* Footer matching other pages */}
            <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
                <p>Total : {filteredUsers.length} utilisateur(s)</p>
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
                onConfirm={handleDeleteUser}
                title="Supprimer l'utilisateur"
                message={`Êtes-vous sûr de vouloir supprimer "${modal.userName}" ? Cette action est irréversible.`}
                confirmText="Supprimer"
                variant="danger"
            />
        </>
    );
};

export default UsersList;
