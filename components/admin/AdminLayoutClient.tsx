"use client";

import { useSidebarStore } from "@/lib/store/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { cn } from "@/lib/utils";

export function AdminLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isOpen } = useSidebarStore();

    return (
        <div className="min-h-screen bg-gray-50 flex overflow-x-hidden relative w-full">
            <AdminSidebar />
            <div
                className={cn(
                    "flex-1 flex flex-col min-w-0 transition-all duration-300",
                    "md:pl-20",
                    isOpen && "md:pl-64"
                )}
            >
                <AdminHeader />

                <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-full overflow-x-hidden">
                    <div className="max-w-7xl mx-auto w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
