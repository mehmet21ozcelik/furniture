"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function ContactForm() {
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

    return (
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
    );
}
