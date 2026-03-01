import { constructMetadata } from "@/lib/seo/metadata";
import Image from "next/image";

export const metadata = constructMetadata({
    title: "Hakkımızda | Mobilya Vitrin",
    description: "Yılların tecrübesiyle yaşam alanlarınıza değer katıyoruz.",
});

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="mb-12 text-center">
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-furniture-dark">Hakkımızda</h1>
                <div className="w-16 h-1 bg-furniture-bronze mx-auto mt-6"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="relative aspect-square w-full rounded-lg overflow-hidden order-2 md:order-1">
                    <Image
                        src="https://images.pexels.com/photos/245208/pexels-photo-245208.jpeg?auto=compress&cs=tinysrgb&w=800"
                        alt="Mobilya Üretim Atölyesi"
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="order-1 md:order-2 space-y-6">
                    <h2 className="font-serif text-3xl font-semibold text-furniture-dark">
                        Ustalıktan Sanata Dönüşen Mobilyalar
                    </h2>
                    <div className="prose text-gray-600">
                        <p>
                            Yılların verdiği tecrübe ve ahşaba olan tutkumuzla, yaşam alanlarınızı
                            güzelleştiren mobilyalar tasarlıyor ve üretiyoruz. Her bir parça,
                            ustalarımızın özenli ellerinden çıkarak evlerinize ulaşıyor.
                        </p>
                        <p>
                            Amacımız sadece mobilya satmak değil, evinize estetik, konfor ve ruh katmaktır.
                            Modern teknolojiyi geleneksel el işçiliği ile harmanlayarak yıllarca kullanabileceğiniz
                            dayanıklı ürünler sunuyoruz.
                        </p>
                        <p>
                            Kullanılan malzemelerin kalitesinden, tasarımın zarafetine kadar her detayı
                            titizlikle inceliyoruz. Müşteri memnuniyetini her zaman ön planda tutarak,
                            hayalinizdeki ev dekorasyonunu gerçeğe dönüştürmek için çalışıyoruz.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
