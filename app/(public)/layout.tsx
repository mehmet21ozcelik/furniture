import { Metadata } from "next";
import { Cormorant_Garamond, Lato } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "@/app/globals.css";

// Google fonts
const cormorantGaramond = Cormorant_Garamond({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-heading",
});

const lato = Lato({
    subsets: ["latin"],
    weight: ["300", "400", "700"],
    variable: "--font-body",
});

import { getSiteSettings } from "@/lib/services/settings.service";
import { siteConfig } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
    const settings = await getSiteSettings();
    return {
        title: settings.metaTitle || siteConfig.name,
        description: settings.metaDescription || siteConfig.description,
    };
}

export const dynamic = 'force-dynamic';

export default function PublicLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className={`min-h-screen flex flex-col ${cormorantGaramond.variable} ${lato.variable} font-sans`}>
            <Header />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    );
}
