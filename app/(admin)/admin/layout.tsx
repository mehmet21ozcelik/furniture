"use client";

import { useSidebarStore } from "@/lib/store/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isOpen, toggle } = useSidebarStore();

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <AdminSidebar />
            <div
                className={cn(
                    "flex-1 flex flex-col transition-all duration-300",
                    "md:pl-20",
                    isOpen && "md:pl-64"
                )}
            >
                <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-4 shadow-sm sm:px-6">
                    <button
                        onClick={toggle}
                        className="flex h-10 w-10 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-furniture-bronze"
                    >
                        <span className="sr-only">Toggle sidebar</span>
                        <Menu className="h-6 w-6" aria-hidden="true" />
                    </button>

                    <div className="flex flex-1 justify-end">
                        <div className="flex items-center gap-4">
                            <a href="/" target="_blank" className="text-sm font-medium text-furniture-bronze hover:underline">
                                Siteyi Görüntüle
                            </a>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
