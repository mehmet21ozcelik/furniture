import Link from "next/link";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/lib/seo/metadata";

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/" className="font-serif text-2xl font-bold text-furniture-dark">
                            {siteConfig.name}
                        </Link>
                    </div>
                    <nav className="hidden md:flex flex-1 justify-center space-x-8 text-sm font-medium">
                        <Link href="/" className="text-muted-foreground hover:text-furniture-bronze transition-colors">
                            Ana Sayfa
                        </Link>
                        <Link href="/products" className="text-muted-foreground hover:text-furniture-bronze transition-colors">
                            Ürünler
                        </Link>
                        <Link href="/about" className="text-muted-foreground hover:text-furniture-bronze transition-colors">
                            Hakkımızda
                        </Link>
                        <Link href="/contact" className="text-muted-foreground hover:text-furniture-bronze transition-colors">
                            İletişim
                        </Link>
                    </nav>
                    <div className="flex items-center space-x-4">
                        <a
                            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden md:inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-green-600 text-white hover:bg-green-700 h-9 px-4 py-2"
                        >
                            WhatsApp
                        </a>
                        {/* Mobile menu button could be added here later */}
                    </div>
                </div>
            </div>
        </header>
    );
}
