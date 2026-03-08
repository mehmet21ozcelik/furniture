import Link from "next/link";
import Image from "next/image";
import { ProductCard } from "@/components/ui/ProductCard";
import { generateOrganizationSchema } from "@/lib/seo/jsonld";

import { getCategories } from "@/lib/services/category.service";
import { getFeaturedProducts } from "@/lib/services/product.service";
import { getSiteSettings } from "@/lib/services/settings.service";

export default async function HomePage() {
    let categories: any[] = [];
    let featuredProducts: any[] = [];
    let settings = await getSiteSettings();

    try {
        [categories, featuredProducts] = await Promise.all([
            getCategories(),
            getFeaturedProducts(),
        ]);
    } catch (error) {
        console.warn("Database connection skipped during build");
    }

    const jsonLd = generateOrganizationSchema();

    return (
        <>
            {/* JSON-LD Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Hero Section */}
            <section className="relative h-[80vh] min-h-[600px] w-full bg-furniture-dark flex items-center justify-center">
                <div className="absolute inset-0 overflow-hidden">
                    <Image
                        src={settings.heroImage}
                        alt={settings.heroTitle}
                        fill
                        className="object-cover opacity-60"
                        priority
                        sizes="100vw"
                    />
                </div>
                <div className="relative z-10 container mx-auto px-4 text-center text-white">
                    <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 drop-shadow-xl shadow-black">
                        {settings.heroTitle}
                    </h1>
                    <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light drop-shadow-lg shadow-black/80">
                        {settings.heroSubtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/products"
                            className="inline-flex items-center justify-center rounded-md bg-furniture-bronze px-8 py-3 text-sm font-medium text-white hover:bg-furniture-bronze/90 transition-colors"
                        >
                            Koleksiyonu İncele
                        </Link>
                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center rounded-md border border-white px-8 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors"
                        >
                            İletişime Geç
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Categories */}
            <section className="py-20 bg-furniture-muted">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-furniture-dark mb-4">Kategoriler</h2>
                        <div className="w-16 h-1 bg-furniture-bronze mx-auto"></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {categories.map((category) => (
                            <Link
                                href={`/categories/${category.slug}`}
                                key={category.id}
                                className="group relative h-64 overflow-hidden rounded-lg bg-gray-200"
                            >
                                <div className="absolute inset-0 z-0">
                                    <Image
                                        src={category.image || "/placeholder-category.jpg"}
                                        alt={category.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors z-10" />
                                <div className="absolute inset-0 flex items-center justify-center z-20">
                                    <h3 className="font-serif text-2xl font-semibold text-white tracking-wider drop-shadow-md">
                                        {category.name}
                                    </h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="font-serif text-3xl md:text-4xl font-bold text-furniture-dark mb-4">Öne Çıkanlar</h2>
                            <div className="w-16 h-1 bg-furniture-bronze"></div>
                        </div>
                        <Link href="/products" className="hidden sm:block text-sm font-medium text-furniture-bronze hover:underline group">
                            Tümünü Gör <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                        {featuredProducts.length > 0 ? (
                            featuredProducts.map((product) => (
                                <ProductCard key={product.id} product={product as any} />
                            ))
                        ) : (
                            <p className="col-span-full text-center text-muted-foreground py-10">Henüz öne çıkan ürün bulunmamaktadır.</p>
                        )}
                    </div>

                    <div className="mt-10 text-center sm:hidden">
                        <Link href="/products" className="inline-block text-sm font-medium text-furniture-bronze hover:underline">
                            Tüm Ürünleri Gör →
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
