"use client";

import React from "react";
import Sidebar from "@/components/admin/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute requireAdmin={true}>
            <div className="min-h-screen bg-[#F8F9FA]">
                <Sidebar />
                <div className="pl-64">
                    {children}
                </div>
            </div>
        </ProtectedRoute>
    );
}
