"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
            (e.target as HTMLFormElement).reset();
        }, 1000);
    };

    const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP}`;

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
                        <div className="flex items-start">
                            <div className="bg-furniture-muted p-3 rounded-full mr-4 text-furniture-bronze">
                                <svg xmlns="http://www.w3.org/0000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                            </div>
                            <div>
                                <h3 className="font-medium">Telefon / WhatsApp</h3>
                                <p className="text-muted-foreground">+90 555 123 4567</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="bg-furniture-muted p-3 rounded-full mr-4 text-furniture-bronze">
                                <svg xmlns="http://www.w3.org/0000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                            </div>
                            <div>
                                <h3 className="font-medium">E-posta</h3>
                                <p className="text-muted-foreground">info@mobilyavitrin.com</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="bg-furniture-muted p-3 rounded-full mr-4 text-furniture-bronze">
                                <svg xmlns="http://www.w3.org/0000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            </div>
                            <div>
                                <h3 className="font-medium">Adres</h3>
                                <p className="text-muted-foreground">Modoko Mobilyacılar Ümraniye / İstanbul</p>
                            </div>
                        </div>
                    </div>

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
                </div>

                <div className="bg-white p-8 rounded-lg shadow-sm border">
                    <h2 className="font-serif text-2xl font-semibold mb-6">Mesaj Gönderin</h2>
                    {isSuccess ? (
                        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-md">
                            Mesajınız başarıyla alınmıştır. En kısa sürede size geri dönüş yapacağız.
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
                                <Input id="name" required placeholder="Adınız Soyadınız" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                                <Input id="email" type="email" required placeholder="ornek@email.com" />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Telefon (Opsiyonel)</label>
                                <Input id="phone" type="tel" placeholder="0555..." />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Mesajınız</label>
                                <textarea
                                    id="message"
                                    required
                                    rows={4}
                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    placeholder="Mesajınızı buraya yazın..."
                                />
                            </div>
                            <Button type="submit" disabled={isSubmitting} className="w-full">
                                {isSubmitting ? "Gönderiliyor..." : "Mesajı Gönder"}
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
