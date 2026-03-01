"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Giriş başarısız");
            }

            router.push("/admin");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="font-serif text-3xl">Yönetici Girişi</CardTitle>
                    <p className="text-sm text-muted-foreground mt-2">
                        Panele erişmek için bilgilerinizi giriniz.
                    </p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded border border-red-200 text-sm">
                                {error}
                            </div>
                        )}
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium leading-none" htmlFor="email">
                                    E-posta
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium leading-none" htmlFor="password">
                                    Şifre
                                </label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-2"
                                />
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
