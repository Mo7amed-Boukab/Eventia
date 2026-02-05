"use client";

import React from "react";
import { DollarSign, Calendar, Users, TrendingUp } from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from "recharts";
import StatCard from "@/components/admin/StatCard";

// Mock data as requested
const data = [
    { name: "Jan", revenue: 4000, bookings: 24 },
    { name: "Fév", revenue: 3000, bookings: 13 },
    { name: "Mar", revenue: 2000, bookings: 18 },
    { name: "Avr", revenue: 2780, bookings: 39 },
    { name: "Mai", revenue: 1890, bookings: 48 },
    { name: "Juin", revenue: 2390, bookings: 38 },
    { name: "Juil", revenue: 3490, bookings: 43 },
];

// Mock totals to match visualization
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue Chart */}
                <div className="bg-white p-6 rounded border-1 border-gray-100 h-[420px]">
                    <h3
                        className="text-md font-semibold text-gray-900 mb-6"
                        style={{ fontFamily: "serif" }}
                    >
                        Évolution du Revenu
                    </h3>
                    <div className="h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient
                                        id="colorRevenue"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop offset="5%" stopColor="#C5A059" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#C5A059" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="#eee"
                                />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#9CA3AF" }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#9CA3AF" }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#fff",
                                        border: "1px solid #f0f0f0",
                                        borderRadius: "8px",
                                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                    }}
                                    itemStyle={{ color: "#1A1A1A" }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#C5A059"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Bookings Chart */}
                <div className="bg-white p-6 rounded border border-gray-100 h-[420px]">
                    <h3
                        className="text-md font-semibold text-gray-900 mb-6"
                        style={{ fontFamily: "serif" }}
                    >
                        Statistiques des Réservations
                    </h3>
                    <div className="h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="#eee"
                                />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#9CA3AF" }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#9CA3AF" }}
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{
                                        backgroundColor: "#fff",
                                        border: "1px solid #f0f0f0",
                                        borderRadius: "8px",
                                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                    }}
                                    itemStyle={{ color: "#1A1A1A" }}
                                />
                                <Bar
                                    dataKey="bookings"
                                    fill="#1A1A1A"
                                    radius={[4, 4, 0, 0]}
                                    barSize={40}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
