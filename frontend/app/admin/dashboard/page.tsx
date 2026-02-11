"use client";

import React, { useState, useEffect } from "react";
import {
  DollarSign,
  Calendar,
  Ticket,
  Users,
  Download,
  Loader2,
} from "lucide-react";
import StatCard from "@/components/admin/StatCard";
import DashboardCharts from "@/components/admin/DashboardCharts";
import { statsService, AdminStats } from "@/lib/services/statsService";

// Mock data for charts
const mockChartData = [
  { name: "Jan", revenue: 4000, bookings: 24 },
  { name: "Fév", revenue: 3000, bookings: 13 },
  { name: "Mar", revenue: 2000, bookings: 18 },
  { name: "Avr", revenue: 2780, bookings: 39 },
  { name: "Mai", revenue: 1890, bookings: 48 },
  { name: "Juin", revenue: 2390, bookings: 38 },
  { name: "Juil", revenue: 3490, bookings: 43 },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await statsService.getAdminStats();
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
      setError("Impossible de charger les statistiques.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-[#C5A059] animate-spin mb-3" />
        <p className="text-gray-500 text-sm italic">
          Chargement des statistiques...
        </p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-8 text-center text-red-500">
        {error ||
          "Une erreur est survenue lors du chargement des statistiques."}
      </div>
    );
  }

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
        <button className="flex items-center bg-white text-[#1A1A1A] px-5 py-2.5 rounded text-sm font-medium hover:text-[#C5A060] transition-colors hover:shadow-lg">
          <Download className="w-4 h-4 mr-2" />
          Télécharger le rapport
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Revenu Total"
          value={`${stats.totalRevenue.toLocaleString()} MAD`}
          trend={stats.revenueTrend}
          trendUp={!stats.revenueTrend.startsWith("-")}
          icon={DollarSign}
        />
        <StatCard
          label="Événements Actifs"
          value={stats.activeEvents.toString()}
          trend={stats.eventsTrend}
          trendUp={!stats.eventsTrend.startsWith("-")}
          icon={Calendar}
        />
        <StatCard
          label="Réservations"
          value={stats.totalReservations.toString()}
          trend={stats.reservationsTrend}
          trendUp={!stats.reservationsTrend.startsWith("-")}
          icon={Ticket}
        />
        <StatCard
          label="Utilisateurs"
          value={stats.totalUsers.toString()}
          trend={stats.usersTrend}
          trendUp={!stats.usersTrend.startsWith("-")}
          icon={Users}
        />
      </div>

      <DashboardCharts data={mockChartData} />
    </div>
  );
}
