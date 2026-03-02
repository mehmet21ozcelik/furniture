import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Generic, we will change to Cormorant Garamond / Lato
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Mobilya Vitrin",
    description: "Modern mobilya ürün kataloğu",
    icons: {
        icon: '/favicon.ico',
    }
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="tr">
            <body className={inter.className}>{children}</body>
        </html>
    );
}
