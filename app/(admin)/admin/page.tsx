export const dynamic = 'force-dynamic';

import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Package, FolderTree, Tag, Eye, HardDrive, Cpu, Clock } from "lucide-react";
import { getSystemStatus } from "@/lib/services/system.service";

export default async function AdminDashboard() {
    const [
        totalProducts,
        activeProducts,
        featuredProducts,
        totalCategories,
        systemStatus
    ] = await Promise.all([
        prisma.product.count(),
        prisma.product.count({ where: { isActive: true } }),
        prisma.product.count({ where: { isFeatured: true } }),
        prisma.category.count(),
        getSystemStatus()
    ]);

    const formatUptime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${h}s ${m}d`;
    };

    return (
        <div className="space-y-8">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mb-8">Dashboard</h1>

            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Toplam Ürün</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-furniture-dark">{totalProducts}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Aktif Ürünler</CardTitle>
                        <Eye className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{activeProducts}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Öne Çıkanlar</CardTitle>
                        <Tag className="h-4 w-4 text-furniture-bronze" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-furniture-bronze">{featuredProducts}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Kategoriler</CardTitle>
                        <FolderTree className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{totalCategories}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-serif font-bold text-gray-900 mb-4">Sistem Durumu</h2>
                <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Disk Kullanımı (/)</CardTitle>
                            <HardDrive className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{systemStatus.diskUsage?.percent || "N/A"}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {systemStatus.diskUsage?.used} / {systemStatus.diskUsage?.total} kullanılıyor
                            </p>
                            <div className="w-full bg-gray-100 h-2 rounded-full mt-3 overflow-hidden">
                                <div
                                    className="bg-orange-500 h-full rounded-full transition-all duration-500"
                                    style={{ width: systemStatus.diskUsage?.percent || '0%' }}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Uygulama Belleği (RAM)</CardTitle>
                            <Cpu className="h-4 w-4 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{systemStatus.memoryUsage.total}</div>
                            <p className="text-xs text-muted-foreground mt-1">Süreç başına ayrılmış bellek</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Uygulama Çalışma Süresi</CardTitle>
                            <Clock className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatUptime(systemStatus.uptime)}</div>
                            <p className="text-xs text-muted-foreground mt-1">Son deploydan bu yana gecen sure</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
