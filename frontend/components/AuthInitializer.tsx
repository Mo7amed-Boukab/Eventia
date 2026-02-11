"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";

export default function AuthInitializer() {
    const checkAuth = useAuthStore((state) => state.checkAuth);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return null;
}
