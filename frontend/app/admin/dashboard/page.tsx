import React from "react";
import { DollarSign, Calendar, Users, TrendingUp } from "lucide-react";
import StatCard from "@/components/admin/StatCard";
import DashboardCharts from "@/components/admin/DashboardCharts";

export const metadata = {
    title: "Dashboard | Admin | Eventia",
    description: "Vue d'ensemble de vos statistiques et performances sur Eventia.",
};

// Mock data
const data = [
    { name: "Jan", revenue: 4000, bookings: 24 },
    { name: "Fév", revenue: 3000, bookings: 13 },
    { name: "Mar", revenue: 2000, bookings: 18 },
    { name: "Avr", revenue: 2780, bookings: 39 },
    { name: "Mai", revenue: 1890, bookings: 48 },
    { name: "Juin", revenue: 2390, bookings: 38 },
    { name: "Juil", revenue: 3490, bookings: 43 },
];

const TOTAL_REVENUE = 19460;
const ACTIVE_EVENTS = 3;

export default function DashboardPage() {
    return (
        <div className="px-8 py-6 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2
                        className="text-2xl font-semibold text-gray-900"
                        style={{ fontFamily: "serif" }}
                    >
                        Vue d&apos;ensemble
                    </h2>
                    <p className="text-gray-500 mt-1">
                        Bienvenue sur votre espace de gestion Eventia.
                    </p>
                </div>
                <button className="bg-[#1A1A1A] text-white px-5 py-2.5 rounded text-sm font-medium hover:bg-gray-800 transition-colors shadow-lg">
                    Télécharger le rapport
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Revenu Total"
                    value={`${TOTAL_REVENUE.toLocaleString()} MAD`}
                    trend="+12.5%"
                    trendUp={true}
                    icon={DollarSign}
                />
                <StatCard
                    label="Événements Actifs"
                    value={ACTIVE_EVENTS.toString()}
                    trend="+2"
                    trendUp={true}
                    icon={Calendar}
                />
                <StatCard
                    label="Nouveaux Clients"
                    value="128"
                    trend="+4.3%"
                    trendUp={true}
                    icon={Users}
                />
                <StatCard
                    label="Taux de Remplissage"
                    value="85%"
                    trend="-1.2%"
                    trendUp={false}
                    icon={TrendingUp}
                />
            </div>

            <DashboardCharts data={data} />
        </div>
    );
}
