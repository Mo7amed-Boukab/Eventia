"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    User, Mail, Shield, Lock, Loader2, Save,
    ChevronRight, Ticket, LogOut, Eye, EyeOff, Pencil
} from "lucide-react";
import { userService } from "@/lib/services/userService";
import { useToastStore } from "@/stores/toastStore";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateProfileSchema, changePasswordSchema } from "@/lib/validations";
import { validateForm } from "@/lib/utils/validateForm";

export default function ProfileForm() {
    const { user: authUser, setUser: setAuthUser, logout, isLoading: authLoading } = useAuthStore();
    const router = useRouter();
    const toast = useToastStore();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'general' | 'security'>('general');

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
    });

    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);



    useEffect(() => {
        if (!authLoading) {
            if (!authUser) {
                router.push("/login?redirect=/profile");
            } else if (authUser.role === 'ADMIN') {
                router.push("/admin/dashboard");
            }
        }
    }, [authLoading, authUser, router]);

    useEffect(() => {
        if (authUser) {
            setFormData({
                first_name: authUser.first_name || "",
                last_name: authUser.last_name || "",
                email: authUser.email || "",
            });
            setLoading(false);
        }
    }, [authUser]);

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation avec Zod
        const result = validateForm(updateProfileSchema, {
            first_name: formData.first_name,
            last_name: formData.last_name,
        });

        if (!result.success) {
            const firstError = Object.values(result.errors)[0];
            toast.error(firstError);
            return;
        }

        try {
            setSaving(true);
            const updatedUser = await userService.updateMe({
                first_name: formData.first_name,
                last_name: formData.last_name,
            });
            setAuthUser(updatedUser);
            toast.success("Profil mis à jour avec succès");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Erreur lors de la mise à jour");
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation avec Zod
        const result = validateForm(changePasswordSchema, {
            oldPassword: passwordData.oldPassword,
            newPassword: passwordData.newPassword,
            confirmPassword: passwordData.confirmPassword,
        });

        if (!result.success) {
            const firstError = Object.values(result.errors)[0];
            toast.error(firstError);
            return;
        }

        try {
            setSaving(true);
            await userService.changePassword(
                passwordData.oldPassword,
                passwordData.newPassword
            );
            toast.success("Mot de passe modifié avec succès");
            setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Erreur lors du changement de mot de passe");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-[#C5A059] animate-spin mb-4" />
                <p className="text-gray-500 italic">Chargement...</p>
            </div>
        );
    }

    const initials = `${formData.first_name[0] || ''}${formData.last_name[0] || ''}`;

    return (
        <div className="flex flex-col lg:flex-row gap-8 pb-20 items-stretch">
            {/* Sidebar Navigation */}
            <div className="w-full lg:w-72 flex flex-col gap-6">
                {/* Profile Overview Card */}
                <div className="bg-white border border-gray-100 rounded-sm p-8 text-center flex-1 flex flex-col justify-center">
                    <div className="relative w-24 h-24 mx-auto mb-4 group">
                        <div className="w-full h-full rounded-full bg-[#1A1A1A] flex items-center justify-center text-[#C5A059] text-2xl font-serif font-bold border-4 border-gray-50 uppercase overflow-hidden">
                            {initials}
                        </div>
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 font-serif capitalize">
                        {formData.first_name} {formData.last_name}
                    </h2>
                    <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mt-1">
                        {authUser?.role}
                    </p>
                </div>

                {/* Tabs Menu */}
                <div className="bg-white border border-gray-100 rounded-sm overflow-hidden text-sm flex-1">
                    <button
                        onClick={() => setActiveTab('general')}
                        className={`w-full flex items-center justify-between p-4 transition-all duration-300 border-l-[3px] ${activeTab === 'general'
                            ? "border-[#C5A059] bg-gray-50 text-gray-900"
                            : "border-transparent text-gray-500 hover:bg-gray-50"
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <User size={18} />
                            <span>Informations</span>
                        </div>
                        {activeTab === 'general' && <ChevronRight size={14} className="text-[#C5A059]" />}
                    </button>
                    <button
                        onClick={() => setActiveTab('security')}
                        className={`w-full flex items-center justify-between p-4 transition-all duration-300 border-l-[3px] ${activeTab === 'security'
                            ? "border-[#C5A059] bg-gray-50 text-gray-900"
                            : "border-transparent text-gray-500 hover:bg-gray-50"
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <Shield size={18} />
                            <span>Sécurité</span>
                        </div>
                        {activeTab === 'security' && <ChevronRight size={14} className="text-[#C5A059]" />}
                    </button>

                    <div className="h-px bg-gray-100 my-1 mx-4"></div>

                    <Link
                        href="/my-reservations"
                        className="w-full flex items-center justify-between p-4 text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <Ticket size={18} />
                            <span>Mes Réservations</span>
                        </div>
                        <ChevronRight size={14} className="opacity-40" />
                    </Link>

                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 p-4 text-red-500 hover:bg-red-50 transition-all border-l-[3px] border-transparent mt-2"
                    >
                        <LogOut size={18} />
                        <span>Déconnexion</span>
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-white border border-gray-100 rounded-sm p-10 min-h-[550px]">
                {activeTab === 'general' && (
                    <div className="animate-in fade-in duration-500">
                        <div className="mb-10">
                            <h3 className="text-2xl font-bold text-[#1A1A1A] font-serif mb-1">Informations du Profil</h3>
                            <p className="text-sm text-gray-400 tracking-wide">Mettez à jour vos informations personnelles.</p>
                        </div>

                        <form onSubmit={handleProfileSubmit} className="w-full space-y-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Prénom</label>
                                    <input
                                        type="text"
                                        value={formData.first_name}
                                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                        className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-sm text-sm text-gray-700 focus:outline-none focus:border-[#C5A059] transition-all"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Nom</label>
                                    <input
                                        type="text"
                                        value={formData.last_name}
                                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                        className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-sm text-gray-700 text-sm focus:outline-none focus:border-[#C5A059] transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Adresse E-mail</label>
                                <div className="relative">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        className="w-full pl-14 pr-5 py-3 bg-gray-100 border border-transparent rounded-sm text-sm text-gray-500 cursor-not-allowed font-medium"
                                        disabled
                                    />
                                </div>
                                <p className="text-[11px] text-gray-400 italic">L'adresse e-mail est utilisée pour la connexion et ne peut être shadifiée.</p>
                            </div>

                            <div className="pt-6">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-10 py-3.5 bg-[#1A1A1A] text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-[#C5A059] transition-all flex items-center gap-3 shadow-xl disabled:opacity-50"
                                >
                                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                    Enregistrer les modifications
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {activeTab === 'security' && (
                    <div className="animate-in fade-in duration-500">
                        <div className="mb-10">
                            <h3 className="text-2xl font-bold text-[#1A1A1A] font-serif mb-1">Sécurité du Compte</h3>
                            <p className="text-sm text-gray-400 tracking-wide">Renforcez la protection de vos accès.</p>
                        </div>

                        <form onSubmit={handlePasswordSubmit} className="max-w-md space-y-8">
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Ancien Mot de Passe</label>
                                    <div className="relative">
                                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                        <input
                                            type={showOldPassword ? "text" : "password"}
                                            value={passwordData.oldPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                            className="w-full pl-14 pr-12 py-3 bg-gray-50 text-gray-700 border border-gray-100 rounded-sm text-sm focus:outline-none focus:border-[#C5A059] transition-all"
                                            required
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowOldPassword(!showOldPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showOldPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Nouveau Mot de Passe</label>
                                    <div className="relative">
                                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            className="w-full pl-14 pr-12 py-3 bg-gray-50 text-gray-700 border border-gray-100 rounded-sm text-sm focus:outline-none focus:border-[#C5A059] transition-all"
                                            required
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showNewPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Confirmer le Mot de Passe</label>
                                    <div className="relative">
                                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            className="w-full pl-14 pr-12 py-3 bg-gray-50 text-gray-700 border border-gray-100 rounded-sm text-sm focus:outline-none focus:border-[#C5A059] transition-all"
                                            required
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="px-10 py-3.5 bg-[#1A1A1A] text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-red-700 transition-all flex items-center gap-3 shadow-xl disabled:opacity-50"
                                    >
                                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Shield size={16} />}
                                        Mettre à jour la sécurité
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
