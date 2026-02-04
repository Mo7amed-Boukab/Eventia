"use client";

import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const data = [
    { name: "Jan", value: 24 },
    { name: "Fév", value: 13 },
    { name: "Mar", value: 18 },
    { name: "Avr", value: 39 },
    { name: "Mai", value: 48 },
    { name: "Juin", value: 38 },
    { name: "Juil", value: 43 },
];

const ReservationsChart: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded border border-gray-100 h-[400px]">
            <h3
                className="text-md font-medium text-gray-900 mb-6"
                style={{ fontFamily: "serif" }}
            >
                Statistiques des Réservations
            </h3>
            <ResponsiveContainer width="100%" height="85%">
                <BarChart
                    data={data}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9CA3AF', fontSize: 9 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9CA3AF', fontSize: 10 }}
                    />
                    <Tooltip
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{
                            backgroundColor: '#111',
                            border: 'none',
                            color: '#fff',
                            borderRadius: '4px'
                        }}
                        itemStyle={{ color: '#fff' }}
                    />
                    <Bar
                        dataKey="value"
                        fill="#1A1A1A"
                        radius={[4, 4, 0, 0]}
                        barSize={40}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ReservationsChart;
