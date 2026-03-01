"use client"

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, FolderTree, LogOut, Menu } from "lucide-react";
import { useSidebarStore } from "@/lib/store/sidebar";
import { cn } from "@/lib/utils";

const menuItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/products", icon: Package, label: "Ürünler" },
    { href: "/admin/categories", icon: FolderTree, label: "Kategoriler" },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { isOpen } = useSidebarStore();

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/login");
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 z-40 h-screen border-r bg-slate-900 text-slate-50 transition-transform sm:translate-x-0 hidden md:flex md:flex-col",
                isOpen ? "w-64" : "w-20"
            )}
        >
            <div className="flex h-16 items-center justify-center border-b border-slate-700 px-4">
                {isOpen ? (
                    <span className="font-bold text-lg tracking-wider">YÖNETİM</span>
                ) : (
                    <span className="font-bold text-lg">Y</span>
                )}
            </div>

            <div className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-2 px-3">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                        const Icon = item.icon;

                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-furniture-bronze text-white"
                                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                    )}
                                    title={!isOpen ? item.label : undefined}
                                >
                                    <Icon className="h-5 w-5 flex-shrink-0" />
                                    {isOpen && <span className="ml-3">{item.label}</span>}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>

            <div className="border-t border-slate-700 p-4">
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
                    title={!isOpen ? "Çıkış Yap" : undefined}
                >
                    <LogOut className="h-5 w-5 flex-shrink-0 text-red-500" />
                    {isOpen && <span className="ml-3">Çıkış Yap</span>}
                </button>
            </div>
        </aside>
    );
}
