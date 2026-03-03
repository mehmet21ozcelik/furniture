"use client";

import { useSidebarStore } from "@/lib/store/sidebar";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function AdminHeader() {
    const { isOpen, toggle } = useSidebarStore();

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-4 shadow-sm sm:px-6">
            <button
                onClick={toggle}
                className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-300",
                    "hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-furniture-bronze/20",
                    "md:border-none md:shadow-none md:bg-transparent md:text-slate-500 md:hover:bg-slate-100"
                )}
            >
                <span className="sr-only">Toggle sidebar</span>
                {isOpen ? (
                    <X className="h-6 w-6 text-furniture-bronze" aria-hidden="true" />
                ) : (
                    <Menu className="h-6 w-6" aria-hidden="true" />
                )}
            </button>

            <div className="flex flex-1 justify-end">
                <div className="flex items-center gap-4">
                    <Link href="/" target="_blank" className="text-sm font-medium text-furniture-bronze hover:underline">
                        Siteyi Görüntüle
                    </Link>
                </div>
            </div>
        </header>
    );
}
