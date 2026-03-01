import Link from "next/link";
import { siteConfig } from "@/lib/seo/metadata";

export default function Footer() {
    return (
        <footer className="bg-furniture-muted border-t mt-auto">
            <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="font-serif text-xl font-bold mb-4">{siteConfig.name}</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Modern ve şık mobilya tasarımları ile evinize değer katıyoruz. Kalite ve zarafetin buluşma noktası.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Hızlı Bağlantılar</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/" className="hover:text-furniture-bronze">Ana Sayfa</Link></li>
                            <li><Link href="/products" className="hover:text-furniture-bronze">Tüm Ürünler</Link></li>
                            <li><Link href="/about" className="hover:text-furniture-bronze">Hakkımızda</Link></li>
                            <li><Link href="/contact" className="hover:text-furniture-bronze">İletişim</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Kategoriler</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/categories/oturma-odasi" className="hover:text-furniture-bronze">Oturma Odası</Link></li>
                            <li><Link href="/categories/yatak-odasi" className="hover:text-furniture-bronze">Yatak Odası</Link></li>
                            <li><Link href="/categories/yemek-odasi" className="hover:text-furniture-bronze">Yemek Odası</Link></li>
                            <li><Link href="/categories/aksesuar" className="hover:text-furniture-bronze">Aksesuar</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">İletişim</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>İstanbul, Türkiye</li>
                            <li>info@mobilyavitrin.com</li>
                            <li>+90 555 123 4567</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 border-t pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} {siteConfig.name}. Tüm hakları saklıdır.
                    </p>
                    <div className="mt-4 md:mt-0">
                        <Link href="/login" className="text-xs text-muted-foreground hover:underline">
                            Yönetici Girişi
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
