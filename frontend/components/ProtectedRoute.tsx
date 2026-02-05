"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

interface ProtectedRouteProps {
    children: ReactNode;
    requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            // Si l'utilisateur n'est pas connecté, rediriger vers login
            if (!isAuthenticated) {
                router.push("/login");
                return;
            }

            // Si la route requiert un admin mais l'utilisateur n'est pas admin
            if (requireAdmin && user?.role !== "ADMIN") {
                router.push("/"); // Rediriger vers home
                return;
            }
        }
    }, [isAuthenticated, isLoading, user, router, requireAdmin]);

    // Afficher un loader pendant la vérification
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Vérification de l'authentification...</p>
                </div>
            </div>
        );
    }

    // Si pas authentifié ou pas les bonnes permissions, ne rien afficher
    // (la redirection est en cours)
    if (!isAuthenticated || (requireAdmin && user?.role !== "ADMIN")) {
        return null;
    }

    // Tout est OK, afficher le contenu
    return <>{children}</>;
}
