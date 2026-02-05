"use client";

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

interface ChartData {
    name: string;
    revenue: number;
    bookings: number;
}

interface DashboardChartsProps {
    data: ChartData[];
}

export default function DashboardCharts({ data }: DashboardChartsProps) {
    return (
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
    );
}
