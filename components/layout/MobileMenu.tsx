"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    return (
        <div className="md:hidden">
            <button
                onClick={toggle}
                className="inline-flex items-center justify-center p-2 rounded-md text-furniture-dark hover:text-furniture-bronze hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-furniture-bronze transition-colors"
                aria-expanded={isOpen}
            >
                <span className="sr-only">Menüyü aç/kapat</span>
                {isOpen ? (
                    <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                    <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
            </button>

            {/* Mobile menu, show/hide based on menu state. */}
            {isOpen && (
                <div className="absolute top-16 left-0 right-0 w-full bg-white border-b shadow-lg z-50 animate-in slide-in-from-top-2">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-center">
                        <Link
                            href="/"
                            onClick={toggle}
                            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-furniture-bronze hover:bg-slate-50 transition-colors"
                        >
                            Ana Sayfa
                        </Link>
                        <Link
                            href="/products"
                            onClick={toggle}
                            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-furniture-bronze hover:bg-slate-50 transition-colors"
                        >
                            Ürünler
                        </Link>
                        <Link
                            href="/about"
                            onClick={toggle}
                            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-furniture-bronze hover:bg-slate-50 transition-colors"
                        >
                            Hakkımızda
                        </Link>
                        <Link
                            href="/contact"
                            onClick={toggle}
                            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-furniture-bronze hover:bg-slate-50 transition-colors"
                        >
                            İletişim
                        </Link>

                        <div className="pt-4 w-full px-4">
                            <a
                                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex w-full items-center justify-center rounded-md bg-green-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-700 transition-colors"
                            >
                                WhatsApp İletişim
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
