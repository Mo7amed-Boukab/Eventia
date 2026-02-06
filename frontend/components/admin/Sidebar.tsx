"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Calendar,
    Users,
    FileText,
    Settings,
    LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Sidebar: React.FC = () => {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const sidebarRef = useRef<HTMLDivElement>(null);

    const isActive = (path: string) => {
        return pathname === path
            ? "bg-[#C5A059] text-white shadow-lg hover:shadow-[#C5A059]/20"
            : "text-gray-400 hover:text-white hover:bg-white/10 hover:shadow-lg hover:shadow-black/10";
    };

    const navItems = [
        { path: "/admin/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
        { path: "/admin/events", label: "Événements", icon: Calendar },
        { path: "/admin/reservations", label: "Réservations", icon: FileText },
        { path: "/admin/users", label: "Utilisateurs", icon: Users },
    ];

    const handleLogout = async () => {
        await logout();
        window.location.href = "/login";
    };

    return (
        <aside
            ref={sidebarRef}
            className="w-64 bg-[#111111] h-screen fixed left-0 top-0 flex flex-col border-r border-gray-800 z-50 overflow-y-auto"
        >
            {/* Brand */}
            <div className="h-20 flex items-center px-8 border-b border-gray-800">
                <h1 className="text-2xl font-bold text-white tracking-wide" style={{ fontFamily: 'serif' }}>
                    Eventia<span className="text-[#C5A059]">.</span>
                </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
                <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    Menu Principal
                </p>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex items-center px-4 py-2.5 rounded transition-all duration-200 group ${isActive(
                                item.path
                            )}`}
                        >
                            <Icon className="w-5 h-5 mr-3" />
                            <span className="font-medium text-sm">{item.label}</span>
                        </Link>
                    );
                })}

                <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-8 mb-4">
                    Système
                </p>
                <button className="w-full flex items-center px-4 py-3 text-gray-400 hover:text-white hover:bg-white/10 hover:shadow-lg hover:shadow-black/10 rounded transition-colors">
                    <Settings className="w-5 h-5 mr-3" />
                    <span className="font-medium text-sm">Paramètres</span>
                </button>
            </nav>

            {/* User Profile / Logout */}
            <div className="p-4 border-t border-gray-800">
                <div className="flex items-center p-3 rounded-lg bg-white/5 mb-3">
                    <div className="w-10 h-10 rounded-full bg-[#C5A059] flex items-center justify-center text-white font-bold text-lg">
                        {user?.first_name?.[0]?.toUpperCase() || "A"}
                    </div>
                    <div className="ml-3 overflow-hidden">
                        <p className="text-sm font-medium text-white truncate">
                            {user?.first_name || "Admin"}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                            {user?.email || "admin@eventia.ma"}
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center justify-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    Déconnexion
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
