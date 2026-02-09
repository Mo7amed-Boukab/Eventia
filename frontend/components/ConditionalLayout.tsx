"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ConditionalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith("/admin");

    return (
        <div className="flex flex-col min-h-screen">
            {!isAdmin && <Header />}
            <div className="grow">{children}</div>
            {!isAdmin && <Footer />}
        </div>
    );
}
