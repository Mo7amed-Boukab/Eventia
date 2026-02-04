import React from "react";
import { ArrowUpRight, ArrowDownRight, LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: LucideIcon;
}

const StatCard: React.FC<StatsCardProps> = ({
  label,
  value,
  trend,
  trendUp,
  icon: Icon,
}) => {
  return (
    <div className="bg-white p-6 rounded-md border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {label}
          </p>
          <h3
            className="text-2xl font-semibold text-gray-900 mt-2"
            style={{ fontFamily: "serif" }}
          >
            {value}
          </h3>
        </div>
        <div className="p-3 bg-[#C5A059]/10 rounded">
          <Icon className="w-6 h-6 text-[#C5A059]" />
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <span
          className={`flex items-center text-xs font-medium ${
            trendUp ? "text-green-700" : "text-red-700"
          }`}
        >
          {trendUp ? (
            <ArrowUpRight className="w-4 h-4 mr-1" />
          ) : (
            <ArrowDownRight className="w-4 h-4 mr-1" />
          )}
          {trend}
        </span>
        <span className="text-xs font-base text-gray-500 ml-2">vs mois dernier</span>
      </div>
    </div>
  );
};

export default StatCard;
