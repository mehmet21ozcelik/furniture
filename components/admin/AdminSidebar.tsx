"use client"

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, FolderTree, LogOut, Settings, X } from "lucide-react";
import { useSidebarStore } from "@/lib/store/sidebar";
import { cn } from "@/lib/utils";

const menuItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/products", icon: Package, label: "Ürünler" },
    { href: "/admin/categories", icon: FolderTree, label: "Kategoriler" },
    { href: "/admin/settings", icon: Settings, label: "Ayarlar" },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { isOpen, toggle, setOpen } = useSidebarStore();

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/login");
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm transition-opacity md:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            <aside
                className={cn(
                    "fixed left-0 top-0 z-40 h-screen border-r bg-slate-900 text-slate-50 transition-all duration-300 ease-in-out",
                    "flex flex-col",
                    isOpen
                        ? "translate-x-0 w-64 shadow-2xl"
                        : "-translate-x-full w-64 md:translate-x-0 md:w-20"
                )}
            >
                <div className="flex h-16 items-center justify-between border-b border-slate-700 px-4">
                    <div className={cn(
                        "font-bold text-lg tracking-wider transition-all duration-300",
                        !isOpen && "md:opacity-0 md:w-0 overflow-hidden"
                    )}>
                        YÖNETİM
                    </div>
                    {!isOpen && (
                        <div className="font-bold text-lg hidden md:block transition-all duration-300">Y</div>
                    )}
                    <button
                        onClick={() => setOpen(false)}
                        className="rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white md:hidden"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto py-4 overflow-x-hidden">
                    <ul className="space-y-2 px-3">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                            const Icon = item.icon;

                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        onClick={() => {
                                            if (window.innerWidth < 768) setOpen(false);
                                        }}
                                        className={cn(
                                            "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                                            isActive
                                                ? "bg-furniture-bronze text-white"
                                                : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                        )}
                                        title={!isOpen ? item.label : undefined}
                                    >
                                        <Icon className="h-5 w-5 flex-shrink-0" />
                                        {(isOpen || (typeof window !== 'undefined' && window.innerWidth < 768)) && (
                                            <span className={cn(
                                                "ml-3 transition-opacity duration-300",
                                                !isOpen && "md:opacity-0 md:hidden"
                                            )}>
                                                {item.label}
                                            </span>
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <div className="border-t border-slate-700 p-4">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white whitespace-nowrap"
                        title={!isOpen ? "Çıkış Yap" : undefined}
                    >
                        <LogOut className="h-5 w-5 flex-shrink-0 text-red-500" />
                        {(isOpen || (typeof window !== 'undefined' && window.innerWidth < 768)) && (
                            <span className={cn(
                                "ml-3 transition-opacity duration-300",
                                !isOpen && "md:opacity-0 md:hidden"
                            )}>
                                Çıkış Yap
                            </span>
                        )}
                    </button>
                </div>
            </aside>
        </>
    );
}
