import { getSiteSettings } from "@/lib/services/settings.service";
import { ContactForm } from "./ContactForm";

export default async function ContactPage() {
    const settings = await getSiteSettings();
    const whatsappUrl = settings.whatsapp ? `https://wa.me/${settings.whatsapp}` : null;

    return (
        <div className="container mx-auto px-4 py-16 max-w-5xl">
            <div className="mb-12 text-center">
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-furniture-dark">İletişim</h1>
                <div className="w-16 h-1 bg-furniture-bronze mx-auto mt-6"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                    <h2 className="font-serif text-2xl font-semibold mb-6">Bize Ulaşın</h2>
                    <p className="text-muted-foreground mb-8">
                        Ürünlerimiz hakkında bilgi almak, özel sipariş vermek veya herhangi bir sorunuz için
                        iletişim formunu doldurabilir veya doğrudan WhatsApp üzerinden bize ulaşabilirsiniz.
                    </p>

                    <div className="space-y-6">
                        {settings.phone && (
                            <div className="flex items-start">
                                <div className="bg-furniture-muted p-3 rounded-full mr-4 text-furniture-bronze">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                </div>
                                <div>
                                    <h3 className="font-medium">Telefon / WhatsApp</h3>
                                    <p className="text-muted-foreground">{settings.phone}</p>
                                </div>
                            </div>
                        )}
                        {settings.email && (
                            <div className="flex items-start">
                                <div className="bg-furniture-muted p-3 rounded-full mr-4 text-furniture-bronze">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                                </div>
                                <div>
                                    <h3 className="font-medium">E-posta</h3>
                                    <p className="text-muted-foreground">{settings.email}</p>
                                </div>
                            </div>
                        )}
                        {settings.address && (
                            <div className="flex items-start">
                                <div className="bg-furniture-muted p-3 rounded-full mr-4 text-furniture-bronze">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                </div>
                                <div>
                                    <h3 className="font-medium">Adres</h3>
                                    <p className="text-muted-foreground">{settings.address}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {whatsappUrl && (
                        <div className="mt-10">
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex w-full sm:w-auto items-center justify-center rounded-md bg-green-600 px-8 py-3 text-sm font-medium text-white hover:bg-green-700 transition-colors"
                            >
                                Hemen WhatsApp'tan Yazın
                            </a>
                        </div>
                    )}
                </div>

                <ContactForm />
            </div>
        </div>
    );
}
